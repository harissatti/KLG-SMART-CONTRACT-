const { expect } = require("chai");
const { ethers } = require("hardhat");
describe ("KLG",function(){
  let owner;
    let token;
    let klg;
    

    it("deployment",async ()=>{
        [owner,token,token1,allowance,klg,partner,partner1,partner2,partner3,partner4,client,client1,client2,client3,client4]=await ethers.getSigners();
        console.log("Owner",owner.address);
        
        //***************************************deploy token***************************************
         const Token=await ethers.getContractFactory("AURA");
        
        token=await Token.deploy();
        token.deployed();
        console.log(token.address,"AURA token address");

        const Token1=await ethers.getContractFactory("WOLF");
        token1=await Token1.deploy();
        token1.deployed();
        console.log(token1.address,"Wolf token address");


      
        //***************************************deploy KLG***************************************
        const KLG =await hre.ethers.getContractFactory("KLG");
        klg=await KLG.deploy();
        console.log("KLG ADDRESS :",klg.address);
    })

     //***************************************getting the Tokens from  Token contract to owner ***************************************

     it("Checking the balance of Token owner",async ()=> {
      // console.log(await token.decimals());
      const balance=await token.balanceOf(owner.address);
      // console.log(balance);
      expect(await ethers.utils.formatEther(balance)).to.equal('100000000.0');

      const balance1=await token1.balanceOf(owner.address);
      // console.log(balance);
      expect(await ethers.utils.formatEther(balance1)).to.equal('100000000.0');

      });

     //***************************************sending token from owner  to partners ***************************************

     it("transfer the token to partner from owner ",async ()=>{
      const Transfer=await token.connect(owner).transfer(partner.address,ethers.utils.parseEther("50.0"));
      const Transfer1=await token.connect(owner).transfer(partner1.address,ethers.utils.parseEther("50.0"));
      const Transfer2=await token1.connect(owner).transfer(partner2.address,ethers.utils.parseEther("50.0"));
      const Transfer3=await token1.connect(owner).transfer(partner3.address,ethers.utils.parseEther("50.0"));
      const balance=await token.balanceOf(partner.address);
      const balance1=await token.balanceOf(partner1.address);
      const balance2=await token1.balanceOf(partner2.address);
      const balance3=await token1.balanceOf(partner3.address);
      expect(await ethers.utils.formatEther(balance)).to.equal("50.0");
      expect(await ethers.utils.formatEther(balance1)).to.equal("50.0");
      expect(await ethers.utils.formatEther(balance2)).to.equal("50.0");
      expect(await ethers.utils.formatEther(balance3)).to.equal("50.0");
     })

    //***************************************adding currency in klg ***************************************

     it("adding currency in klg",async ()=>{
      //user enter "AURA" name as a currency
      const addCurrency=await klg.addCurrency("0x4155524100000000000000000000000000000000000000000000000000000000",token.address);
      const add=await klg.addressCurrency("0x4155524100000000000000000000000000000000000000000000000000000000");
      expect (await klg.addressCurrency("0x4155524100000000000000000000000000000000000000000000000000000000")).to.equal(token.address);
      const addCurrency1=await klg.addCurrency("0x574f4c4600000000000000000000000000000000000000000000000000000000",token1.address);
      expect (await klg.addressCurrency("0x574f4c4600000000000000000000000000000000000000000000000000000000")).to.equal(token1.address);
      // try {
      //   //if user enter "aura"name in hash as a currency that doesnot exist
      //   const addcurrency=await klg.addressCurrency("0x6175726100000000000000000000000000000000000000000000000000000000")
      //   expect (token.address).to.equal(addcurrency);
      // } catch (error) {
      //   console.log(error.message);
      // }
      // try {
      //   //if user enter "wolf"name in hash as a currency that doesnot exist
      //   const addcurrency=await klg.addressCurrency("0x6175726100000000000000000000000000000000000000000000000000000000")
      //   expect (token1.address).to.equal(addcurrency);
      // } catch (error) {
      //   console.log(error.message);
      // }
     })

    //***************************************adding client in klg by owner ***************************************
     it("adding client in KLG",async ()=>{
      const addClient=await klg.grantRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",client.address);
      expect(await klg.hasRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",client.address)).to.equal(true);

      const addClient1=await klg.grantRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",client1.address);
      expect(await klg.hasRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",client1.address)).to.equal(true);

      //checking client doesnot assing partner role when we asign it as client not as a partner

      // try {
      //   expect(await klg.hasRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",client.address)).to.equal(true);
      // } catch (error) {
      //   console.log(error.message);
      // }

      //checking grantrole function is give permission to other user, not adimn  to adding client  in function

    //   try {
    //     expect(await klg.connect(partner).grantRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",client1.address));
    //   } catch (error) {
    //     console.log(error.message); 
    //   }

     })

     //***************************************adding partner in klg by owner ***************************************
     it("adding partner in KLG",async()=>{
      const addPartner=await klg.grantRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner.address);
      const role=await klg.hasRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner.address);
      expect(await klg.hasRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner.address)).to.equal(true);

      const addPartner1=await klg.grantRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner1.address);
      const role1=await klg.hasRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner1.address);
      expect(await klg.hasRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner1.address)).to.equal(true);

      //checking partner  doesnot assign as client role when we asign it as a partner not as a client
      // try {
      //   const role=await klg.hasRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",partner.address);
    
      //   expect(await klg.hasRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",partner.address)).to.equal(true);
      // } catch (error) {
      //   console.log(error.message);
      // }
      // try {
      //   const role=await klg.hasRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",partner1.address);
    
      //   expect(await klg.hasRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",partner1.address)).to.equal(true);
      // } catch (error) {
      //   console.log(error.message);
      // }

      //checking is grantrole is give permission to other user, not adimn  to adding partner

      // try {
      //   expect(await klg.connect(client).grantRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner.address));
      // } catch (error) {
      //   console.log(error.message); 
      // }
      // try {
      //   expect(await klg.connect(client).grantRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner1.address));
      // } catch (error) {
      //   console.log(error.message); 
      // }

     })

     //***************************************approve KLG for token by partner***************************************

     it("aprove the KLG contract for token by partner",async ()=>{
      const approving = await token.connect(partner).approve(klg.address,ethers.utils.parseEther("30.0"));
      const allowances=await token.connect(partner).allowance(partner.address,klg.address);
      //  console.log(allowances,"allownces");
      const approving1 = await token.connect(partner1).approve(klg.address,ethers.utils.parseEther("30.0"));
      const allowances1=await token.connect(partner1).allowance(partner1.address,klg.address);
      // console.log(allowances1,"allownces");
     })

     //***************************************creating contract by partner***************************************
     it("creating contract by partner",async ()=>{
      const creating =await klg.connect(partner).createEscrow(1234,"car","0x4155524100000000000000000000000000000000000000000000000000000000"
      ,client.address,ethers.utils.parseEther("10.0"),5,1,"https://gateway.pinata.cloud/ipfs/QmRTLuytvBj3C4DRojF1ez5Ljo8N5oXdFbv4uADDS2yeub");
      const geturl=await klg.getescrowHash(1234);
      console.log(geturl);
      console.log(await klg.escrowDetails(1234));

      const creating1 =await klg.connect(partner1).createEscrow(12345,"bus","0x4155524100000000000000000000000000000000000000000000000000000000"
      ,client1.address,ethers.utils.parseEther("10.0"),2,1,"https://gateway.pinata.cloud/ipfs/QmRTLuytvBj3C4DRojF1ez5Ljo8N5oXdFbv4uADDS2yeub");
      console.log(await klg.escrowDetails(12345));

      //creating  contract  with matter number that already exist.
      try {
        const creating =await klg.connect(partner).createEscrow(1234,"car","0x4155524100000000000000000000000000000000000000000000000000000000"
      ,client.address,ethers.utils.parseEther("10.0"),5,1,"https://gateway.pinata.cloud/ipfs/QmRTLuytvBj3C4DRojF1ez5Ljo8N5oXdFbv4uADDS2yeub");
      } catch (error) {
        console.log(error.message);
      }
      // try {
      //   const creating =await klg.connect(partner1).createEscrow(12345,"car","0x4155524100000000000000000000000000000000000000000000000000000000"
      // ,client.address,ethers.utils.parseEther("10.0"),5,1,"https://gateway.pinata.cloud/ipfs/QmRTLuytvBj3C4DRojF1ez5Ljo8N5oXdFbv4uADDS2yeub");
      // } catch (error) {
      //   console.log(error.message);
      // }

      //creating contract by partner that doesnot have money.
      // try {
      //   const addPartner=await klg.grantRole("0x2daed369a5b7514cfb35f0a090c053f66dee078e5d8a6d0f483738c6d8ca05a3",partner4.address);
      //   const creating =await klg.connect(partner4).createEscrow(1235,"car","0x4155524100000000000000000000000000000000000000000000000000000000",
      //   client.address,ethers.utils.parseEther("10.0"),5,1,"https://gateway.pinata.cloud/ipfs/QmRTLuytvBj3C4DRojF1ez5Ljo8N5oXdFbv4uADDS2yeub");
      //   // console.log(await klg.escrowDetails(1235));
      // } catch (error) {
      //   console.log(error.message);
      // }

      //creating contract with address that doesnot approved as a partner
    //   try {
    //     const creating =await klg.connect(partner2).createEscrow(1234,"car","0x4155524100000000000000000000000000000000000000000000000000000000",
    //     client.address,ethers.utils.parseEther("10.0"),5,1,"https://gateway.pinata.cloud/ipfs/QmRTLuytvBj3C4DRojF1ez5Ljo8N5oXdFbv4uADDS2yeub");
    //   } catch (error) {
    //     console.log(error.message);
    //   }
     })

      //***************************************agrement agreed by client***************************************
      it("agrement agreed by client",async ()=>{
        const agree=await klg.connect(client).agreedEscrow(1234);
        // console.log(await klg.escrowDetails(1234));

        const agree1=await klg.connect(client1).agreedEscrow(12345);
        // console.log(await klg.escrowDetails(1234));

        //agree by client that doesnot had agreement with this partner
        // try {
        //   const addClient=await klg.grantRole("0xa5ff3ec7a96cdbba4d2d5172d66bbc73c6db3885f29b21be5da9fa7a7c025232",client1.address);
        //   const agree=await klg.connect(client1).agreedEscrow(1234);
        // } catch (error) {
        //   console.log(error.message);
        // }

        //checking that client agree on contract that he already sign that he agreed
        // try {
        //   const agree1=await klg.connect(client).agreedEscrow(1234);
        // } catch (error) {
        //   console.log(error.message);
        // }
       
      })
      //***************************************claiming amount by client***************************************
      it("claiming amount By client",async()=>{
        //claiming amount of  contract before time
        try {
          const claiming=await klg.connect(client).releaseEscrowAmount(1234);
          const balance1=await token.balanceOf(client.address);
          // console.log(balance1,"client balance1");
        } catch (error) {
          console.log(error.message);
        }
        
        const balance=await token.balanceOf(client.address);
        console.log(balance,"client balance2");
        await network.provider.send("evm_increaseTime", [86500]);
        const claiming=await klg.connect(client).releaseEscrowAmount(1234);
        const balance1=await token.balanceOf(client.address);
        // console.log(balance1,"client balance3");
        // await network.provider.send("evm_increaseTime", [86500]);
        // const claiming1=await klg.connect(client).releaseEscrowAmount(1234);
        // const balance2=await token.balanceOf(client.address);
        // console.log(balance2,"client balance");
        // await network.provider.send("evm_increaseTime", [86500]);
        // const claiming2=await klg.connect(client).releaseEscrowAmount(1234);
        // const balance3=await token.balanceOf(client.address);
        // console.log(balance3,"client balance");

        //claiming amount of other contract 
        try {
          const claiming=await klg.connect(client).releaseEscrowAmount(12345);
          const balance1=await token.balanceOf(client.address);
          // console.log(balance1,"client balance");
        } catch (error) {
          console.log(error.message);
        }
         

        // const view =await klg.escrowDetails(1234);
        //   console.log(view,"view details");

      })
      it("claiming amount By client",async()=>{
        //claiming amount of  contract before time
        try {
          const claiming=await klg.connect(client1).releaseEscrowAmount(12345);
          const balance1=await token.balanceOf(client1.address);
          // console.log(balance1,"client balance1");
        } catch (error) {
          console.log(error.message);
        }


        const balance=await token.balanceOf(client1.address);
        console.log(balance,"client1 balance");
        await network.provider.send("evm_increaseTime", [86500]);
        const claiming=await klg.connect(client1).releaseEscrowAmount(12345);
        const balance1=await token.balanceOf(client1.address);
        // console.log(balance1,"client1 balance");
        // const claiming1=await klg.connect(client1).releaseEscrowAmount(12345);
        // const balance2=await token.balanceOf(client1.address);
        // console.log(balance2,"client1 balance");

        //claiming amount of other contract 
        // try {
        //   const claiming=await klg.connect(client1).releaseEscrowAmount(1234);
        //   const balance1=await token.balanceOf(client1.address);
        //   // console.log(balance1,"client1 balance");
        // } catch (error) {
        //   console.log(error.message);
        // }

        // const view =await klg.escrowDetails(1234);
        //   console.log(view,"view details");

      })


})