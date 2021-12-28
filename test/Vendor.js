const { expect } = require("chai");

describe("Vendor contract", function () {
  it("should mint tokens to vendor contract", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const Vendor = await ethers.getContractFactory("Vendor");

    const hardhatToken = await Token.deploy(1640715766, 16407157700);
    const hardhatVendor = await Vendor.deploy(hardhatToken.address);

    await hardhatToken.mint(hardhatVendor.address, ethers.utils.parseUnits("10000.0", 18));
    
    const contractBalance = await hardhatToken.balanceOf(hardhatVendor.address);
    expect(await hardhatToken.totalSupply()).to.equal(contractBalance);
  });
  it("should send tokens when a wallet contributes ether, and add eth amount to contributors mapping", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const Vendor = await ethers.getContractFactory("Vendor");

    const hardhatToken = await Token.deploy(1640715766, 16407157700);
    const hardhatVendor = await Vendor.deploy(hardhatToken.address);

    await hardhatToken.mint(hardhatVendor.address, ethers.utils.parseUnits("10000.0", 18));
    
    await expect(hardhatVendor.buyTokens({ value: ethers.utils.parseEther("1.1") }))
    .to.emit(hardhatVendor, 'BuyTokens')
    .withArgs(owner.address, ethers.utils.parseEther("1.1"), ethers.utils.parseUnits("1100.0", 18));
    
    expect(await hardhatVendor.contributors(owner.address)).to.equal(ethers.utils.parseEther("1.1"));
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("1100.0", 18));
  });
  it("should contribute ether for tokens, and then sell them back for ether", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const Vendor = await ethers.getContractFactory("Vendor");

    const hardhatToken = await Token.deploy(1640715766, 16407157700);
    const hardhatVendor = await Vendor.deploy(hardhatToken.address);

    await hardhatToken.mint(hardhatVendor.address, ethers.utils.parseUnits("10000.0", 18));
    
    await expect(hardhatVendor.buyTokens({ value: ethers.utils.parseEther("1.1") }))
    .to.emit(hardhatVendor, 'BuyTokens')
    .withArgs(owner.address, ethers.utils.parseEther("1.1"), ethers.utils.parseUnits("1100.0", 18));

    expect(await hardhatVendor.contributors(owner.address)).to.equal(ethers.utils.parseEther("1.1"));
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("1100.0", 18));

    expect(await hardhatToken.approve(hardhatVendor.address, ethers.utils.parseUnits("1100.0", 18)));

    await expect(hardhatVendor.sellTokens(ethers.utils.parseUnits("1100.0", 18)))
    .to.emit(hardhatVendor, 'SellTokens')
    .withArgs(owner.address, ethers.utils.parseUnits("1100.0", 18), ethers.utils.parseEther("1.1"));
    
    expect(await hardhatVendor.contributors(owner.address)).to.equal(0);
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);
  });
});
