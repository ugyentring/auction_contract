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

  it("should return the initial val count 0", async function () {
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  it("should increase the count by 1", async function () {
    await counter.increment();
    const count = await counter.getCount();
    expect(count).to.equal(1);
  });
  
});
