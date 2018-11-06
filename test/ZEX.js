const tap = require("tap");

const accountFixtures = require("./accountFixtures");
const {
  deployZEXContract,
  deployTokenContract,
  getLatestDeployedContract
} = require("../src/utils");
const { USER_1 } = require("../src/zilliqa-node");
const { initContract } = require("../src/zex-transitions");

const userPrivateKey = accountFixtures[USER_1].privateKey;

tap.beforeEach(async function() {
  let txHash = await deployZEXContract();
  console.log("ZEX contract deployed to kaya: " + txHash);
  txHash = await deployTokenContract();
  console.log("Token contract deployed to kaya: " + txHash);
});

tap.test("initContract", async function() {
  const contract = await getLatestDeployedContract("./ZEX.scilla");
  const txHash = await initContract(userPrivateKey, contract.address);
  console.log(txHash);
});
