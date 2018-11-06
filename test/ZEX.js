const tap = require("tap");

const accountFixtures = require("./accountFixtures");
const {
  deployZEXContract,
  deployTokenContract,
  getLatestDeployedContract
} = require("../src/utils");
const { USER_1, OWNER } = require("../src/zilliqa-node");
const {
  initContract,
  makeOrder,
  approveSpend
} = require("../src/zex-transitions");

const ownerPrivateKey = accountFixtures[OWNER].privateKey;
const userPrivateKey = accountFixtures[USER_1].privateKey;

tap.beforeEach(async function() {
  let txHash = await deployZEXContract();
  console.log("ZEX contract deployed to kaya: " + txHash);
  txHash = await deployTokenContract();
  console.log("Token contract deployed to kaya: " + txHash);
});

// tap.test("buy order flow", async function() {
//   let zexContract = await getLatestDeployedContract("./ZEX.scilla");
//   let tokenContract = await getLatestDeployedContract("./FungibleToken.scilla");
//   const zexAddress = zexContract.address;
//   const tokenAddress = tokenContract.address;
//   let txHash = await initContract(ownerPrivateKey, zexAddress);
//   const buyOrder = 0;
//   const amount = 50;
//   const price = 40;
//   txHash = await makeOrder(
//     userPrivateKey,
//     tokenAddress,
//     buyOrder,
//     amount,
//     price
//   );
//   zexContract = await getLatestDeployedContract("./ZEX.scilla");
//   tokenContract = await getLatestDeployedContract("./FungibleToken.scilla");
// });

tap.test("sell order flow", async function() {
  let zexContract = await getLatestDeployedContract("./ZEX.scilla");
  let tokenContract = await getLatestDeployedContract("./FungibleToken.scilla");
  const zexAddress = zexContract.address;
  const tokenAddress = tokenContract.address;
  let txHash = await initContract(ownerPrivateKey, zexAddress);
  txHash = await approveSpend(ownerPrivateKey, zexAddress, 2000);
  const buyOrder = 0;
  const amount = 50;
  const price = 40;
  txHash = await makeOrder(
    userPrivateKey,
    tokenAddress,
    buyOrder,
    amount,
    price
  );
  zexContract = await getLatestDeployedContract("./ZEX.scilla");
  tokenContract = await getLatestDeployedContract("./FungibleToken.scilla");
});
