async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const Vendor = await ethers.getContractFactory("Vendor");
  const token = await Token.deploy(1640641855, 16402641855, { gasLimit: 4000000});
  const vendor = await Vendor.deploy(token.address, { gasLimit: 4000000});

  console.log("Token address:", token.address);
  console.log("Vendor address:", vendor.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
