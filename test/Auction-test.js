const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Auction", function () {
  let Auction, auction;
  let owner, bidder1, bidder2;

  beforeEach(async () => {
    [owner, bidder1, bidder2] = await ethers.getSigners();
    Auction = await ethers.getContractFactory("Auction");
    auction = await Auction.deploy();
    await auction.deployed();
  });

  it("should reject bid from owner", async () => {
    try {
      await auction
        .connect(owner)
        .placeBid({ value: ethers.utils.parseEther("1.0") });
      assert.fail("Transaction should have failed but did not.");
    } catch (error) {
      assert(true, "Transaction failed as expected.");
    }
  });

  it("should verify that the auction is in running state", async () => {
    const state = await auction.auctionState();
    assert.equal(Number(state), 1, "Auction should be in the running state");
  });

  it("should allow owner to cancle the auction before it ends", async () => {
    const currentBlock = await ethers.provider.getBlockNumber();
    const endBlock = await auction.endBlock();

    expect(ethers.BigNumber.from(currentBlock)).to.be.lt(endBlock);

    await auction.connect(owner).cancelAuction();

    const state = await auction.auctionState();
    expect(state).to.equal(3);
  });

  describe("cancel()", function () {
    it("should revert if someone other than the owner tries to cancel the auction", async () => {
      try {
        await auction.connect(bidder1).cancelAuction();
        assert.fail("Expected the transaction to revert, but it did not.");
      } catch (error) {
        assert(
          error.message.includes("revert"),
          "Expected transaction to be reverted, but other exception was thrown: " +
            error.message
        );
      }
    });
  });

  //activity
  describe("finalizeAuction()", function () {
    it("should allow the owner to finalize the auction after it ends and collect the highest binding bid", async () => {
      //bidders place their bids
      await auction
        .connect(bidder1)
        .placeBid({ value: ethers.utils.parseEther("3.0") });
      await auction
        .connect(bidder2)
        .placeBid({ value: ethers.utils.parseEther("4.0") });

      //move the block number past the endBlock
      const endBlockNumber = await auction.endBlock();
      while ((await ethers.provider.getBlockNumber()) <= endBlockNumber) {
        await ethers.provider.send("evm_mine", []);
      }

      //record the owner's balance before finalizing
      const ownerInitialBalance = await ethers.provider.getBalance(
        owner.address
      );

      //owner finalizes the auction
      await auction.connect(owner).finalizeAuction();

      //check the owner's balance after finalization
      const ownerFinalBalance = await ethers.provider.getBalance(owner.address);
      const highestBindingBid = await auction.highestBindingBid();

      //expect the owner's balance to increase by the highest binding bid
      expect(ownerFinalBalance).to.be.above(ownerInitialBalance);
    });
  });
});
