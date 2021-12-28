const { expect } = require("chai");

describe("Token contract", function () {
  it("shouldn't allow transfers outside of start time", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy(10640641855, 16406418551);

    await expect(hardhatToken.mint(owner.address, 1))
    .to.be.revertedWith('tokens cannot be transferred yet');
  });
  it("shouldn't allow transfers outside of end time", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy(1640715766, 1640715770);

    await expect(hardhatToken.mint(owner.address, 1))
    .to.be.revertedWith('tokens cannot be transferred now');
  });
  it("should allow transfers within allowed timeframes, and emit Transfer event", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    const hardhatToken = await Token.deploy(1640715766, 16407157700);

    await expect(hardhatToken.mint(owner.address, 1))
    .to.emit(hardhatToken, 'Transfer')
    .withArgs("0x0000000000000000000000000000000000000000", owner.address, 1);
  });
});
