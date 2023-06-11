// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "hardhat/console.sol";
import "./EscrowStorage.sol";
import "./allowances.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

error AlraeadyUsedMatterNO();
error CurrencyNotAllowed();
error InvalidBalance();
error invalidAllowance();
error InvalidMatterNumber();
error ClientNotAgreed();
error NoAmountLeft();
error NoReleaseLeft();
error NotRecived();
error allreadyAgreed();

contract KLG is AccessControl, Allowances{
    bytes32 public constant PATNER_ROLE = keccak256("PATNER_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");
   
    using escrowStorage for escrowStorage.escrow;
    IERC20 private ERC20;

    using EnumerableSet for EnumerableSet.UintSet;
    EnumerableSet.UintSet private _totalMatterNumbers;

    constructor () {  
     _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
     _grantRole(PATNER_ROLE, msg.sender);
     _grantRole(CLIENT_ROLE, msg.sender);
    }
    
    mapping (uint256=>escrowStorage.escrow)private _escrow;
    mapping(uint256 => string) private _escrowHash;

    function addCurrency(bytes32 currency, address currencyAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _addCurrency(currency, currencyAddress);
    }

    function removeCurrency(bytes32 currency) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _removeCurrency(currency);
    }

    function totalMatters() public view returns(uint256) {
        return _totalMatterNumbers.length();
    }
    function totalMattersNumberByIndex(uint256 index) public view returns(uint256) {
        return _totalMatterNumbers.at(index);
    }

    
    function _createEscrow(
        uint256 matterNumber,
        string memory assetName,
        bytes32 currency,
        address patnerAddress,
        address clientAddress,
        uint256 totalAmount,
        uint64 noOfReleases,
        uint128 duration

    )internal
    {
        uint matterId=matterNumber;
        _escrow[matterId].set(
            matterNumber,
            assetName,
            currency,
            patnerAddress,
            clientAddress,
            totalAmount,
            noOfReleases,
            duration
        );
    }
    
    //escrow can only be created by patners
    function createEscrow(
        uint256 _matterNumber,
        string memory _assetName,
        bytes32 _currency,
        address _clientAddress,
        uint256 _totalAmount,
        uint64 _noOfReleases,
        uint128 _duration,
        string memory _fileHash
    )external onlyRole(PATNER_ROLE)    
    {
        if(_escrow[_matterNumber].peelMatterNumber()==true){revert AlraeadyUsedMatterNO();} // This matter number exist
        if(!_allowedCurrency(_currency)){revert CurrencyNotAllowed();}
        address escrowCurrency = addressCurrency(_currency);
        if(IERC20(escrowCurrency).balanceOf(msg.sender)<_totalAmount){revert InvalidBalance();}
        if(IERC20(escrowCurrency).allowance(msg.sender,address(this))<_totalAmount){revert invalidAllowance();}
        _createEscrow(
            _matterNumber,
            _assetName,
            _currency,
            msg.sender,
            _clientAddress,
            _totalAmount,
            _noOfReleases,
            _duration);
        _escrowHash[_matterNumber]=_fileHash;
        _totalMatterNumbers.add(_matterNumber);
    }
    
    // client agree on terms
    function agreedEscrow(uint256 _matterNumber)public onlyRole(CLIENT_ROLE) {
      if(_escrow[_matterNumber].escrowclientAddress()!=msg.sender){revert InvalidMatterNumber();}
      address escrowCurrency = addressCurrency(_escrow[_matterNumber].escrowCurrency());
      if(IERC20(escrowCurrency).balanceOf(_escrow[_matterNumber].escrowpatnerAddress())<_escrow[_matterNumber].escrowTotalAmount()){revert InvalidBalance();}
      if(IERC20(escrowCurrency).allowance(_escrow[_matterNumber].escrowpatnerAddress(),address(this))<_escrow[_matterNumber].escrowTotalAmount()){revert invalidAllowance();}
      if(_escrow[_matterNumber].escrowIsClientAgreed()==true){revert allreadyAgreed();}
      _escrow[_matterNumber].escrowClientAgreed();
      _escrow[_matterNumber].escrowDate(block.timestamp);
      IERC20(escrowCurrency).transferFrom(_escrow[_matterNumber].escrowpatnerAddress(),address(this),_escrow[_matterNumber].escrowTotalAmount());
     
    }

     function releaseEscrowAmount(uint256 _matterNumber)public onlyRole(CLIENT_ROLE) 
     {
      if(_escrow[_matterNumber].escrowclientAddress()!=msg.sender){revert InvalidMatterNumber();}
      if(!_escrow[_matterNumber].escrowIsClientAgreed()){revert ClientNotAgreed();}
      if(_escrow[_matterNumber].escrowRemainingAmount()<=0){revert NoAmountLeft();}
      if(_escrow[_matterNumber].escrowNoOfReleases()<_escrow[_matterNumber].escrowIsReceivedRelease()){revert NoReleaseLeft();}
      uint256 amount=_escrow[_matterNumber].escrowTotalAmount()/_escrow[_matterNumber].escrowNoOfReleases();
      uint256 releaseNo=_escrow[_matterNumber].escrowIsReceivedRelease();
      releaseNo+=1;
      if(block.timestamp>=_escrow[_matterNumber].escrowEffectDate()+(releaseNo * _escrow[_matterNumber].escrowDuration() *1 days )){
        _escrow[_matterNumber].escrowUpdateRemainingAmount(amount);
        address escrowCurrency = addressCurrency(_escrow[_matterNumber].escrowCurrency());
        IERC20(escrowCurrency).transfer(_escrow[_matterNumber].escrowclientAddress(),amount);
      }else {revert NotRecived();}
       _escrow[_matterNumber].escrowNoOfReceivedRelease();
     }
    
    //escrow details
    function escrowDetails(uint256 _matterNumber)public view returns(uint256 MatterNumber,string memory Assetname,bytes32 currency,address patnerAddr,address clientAddr,bool clientAgree,uint256 TotalAmount,uint64 NoOfReleases){
        return _escrow[_matterNumber].escrowDetails();
    }
    
    //escrow dataHash
    function getescrowHash(uint256 matternumber) public view returns(string memory) {
        return _escrowHash[matternumber];   
    }

    // get All matter number
    function allMatterNumbers() public view returns(uint256[] memory) {
        uint256 matterNumbers = totalMatters();
        uint256[] memory matters = new uint256[](matterNumbers);
        for (uint256 index = 0; index < matterNumbers; ++index) {
            uint256 matterNumber = totalMattersNumberByIndex(index);
            matters[index] = matterNumber;
        }
        return matters;
    }

    function batchDetailsMatters(uint256[] memory matterNumbers) public view returns(escrowStorage.escrow[] memory) {
        escrowStorage.escrow[] memory detailsMatters = new escrowStorage.escrow[](matterNumbers.length);
        for (uint256 index = 0; index < matterNumbers.length; ++index) {
            detailsMatters[index] = _escrow[matterNumbers[index]];
        }
        return detailsMatters;
    }

    
}