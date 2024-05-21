const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Counter contract", function () {
  let Counter;
  let counter;

  beforeEach(async function () {
    Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
    await counter.deployed();
  });

  //question-1
  it("should return the initial val count 0", async function () {
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  //question-2
  it("should increase the count by 1", async function () {
    await counter.increment();
    const count = await counter.getCount();
    expect(count).to.equal(1);
  });

  //question-3
  it("should increase and decrease val by 1", async function () {
    await counter.increment();
    await counter.decrement();
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  //question-4
  it("should revert trasaction when counter is below 0", async function () {
    await expect(counter.decrement()).to.be.revertedWith(
      "Counter: decrement overflow"
    );
  });
});
