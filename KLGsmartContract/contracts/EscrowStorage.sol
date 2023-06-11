// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
library escrowStorage  {
    struct escrow {
        bool _clientAgreed;
        uint64 _noOfReleases;
        uint64 _receivedRelease; 
        uint128 _duration;
        uint256 _matterNumber;
        uint256 _totalAmount;
        uint256 _remainAmount;
        uint256 _escrowdate;
        address _patnerAddress;
        address _clientAddress;
        bytes32 _currency;
        string _assetName;
    }
    function set(
        escrow storage self,
        uint256 matterNumber,
        string memory assetName,
        bytes32 currency,
        address patnerAddress,
        address clientAddress,
        uint256 totalAmount,
        uint64 noOfReleases,
        uint128 duration
        ) internal {
        self._matterNumber = matterNumber;
        self._assetName = assetName;
        self._currency= currency;
        self._patnerAddress = patnerAddress;
        self._clientAddress =  clientAddress; 
        self._totalAmount =totalAmount;
        self._remainAmount =totalAmount;
        self._noOfReleases= noOfReleases;
        self._duration=duration;
        self._receivedRelease=0;
    }
    function escrowDetails(
        escrow storage self
    ) internal view returns(uint256,string memory,bytes32,address,address,bool,uint256,uint64) 
    {
        return (
        self._matterNumber,
        self._assetName,
        self._currency,
        self._patnerAddress,
        self._clientAddress,
        self._clientAgreed,
        self._totalAmount,
        self._noOfReleases);
    }
    function peelMatterNumber(
        escrow storage self
    )internal view returns(bool)
    {
        if(self._matterNumber!=0)
        {
           return true;
        }
        return false;
    }
    function escrowAssetName(
     escrow storage self
    )internal view returns(string memory)
    {
        return self._assetName;
    }
    function escrowNoOfReleases(
     escrow storage self
    )internal view returns(uint64)
    {
        return self._noOfReleases;
    }
    function escrowTotalAmount(
     escrow storage self
    )internal view returns(uint256)
    {
        return self._totalAmount;
    }
    function escrowUpdateRemainingAmount(
     escrow storage self,
     uint256 amount
    )internal 
    {
       self._remainAmount-=amount;
    }
    function escrowRemainingAmount(
     escrow storage self
    )internal view returns(uint256)
    {
        return self._remainAmount;
    }
    function escrowNoOfReceivedRelease(
     escrow storage self
    )internal
    {
        self._receivedRelease+=1;
    }
    function escrowIsReceivedRelease(
     escrow storage self
    )internal view returns(uint256)
    {
        return self._receivedRelease;
    }
    function escrowpatnerAddress(
     escrow storage self
    )internal view returns(address)
    {
        return self._patnerAddress;
    }
    function escrowclientAddress(
     escrow storage self
    )internal view returns(address)
    {
        return self._clientAddress;
    }
    function escrowClientAgreed(
    escrow storage self
    )internal
    {
        self._clientAgreed=true;
    }
    function escrowIsClientAgreed(
    escrow storage self
    )internal view returns(bool)
    {
       return self._clientAgreed;
    }
    function escrowCurrency(
    escrow storage self
    )internal view returns(bytes32)
    {
        return self._currency;
    }
    function escrowDate(
    escrow storage self,
    uint256 escrowdate
    )internal
    {
        self._escrowdate=escrowdate;
    }
    function escrowEffectDate(
    escrow storage self
    )internal view returns(uint256)
    {
        return self._escrowdate;
    } 
    function escrowDuration(
        escrow storage self
    )internal view returns(uint128)
    {
        return self._duration;
    }
}   