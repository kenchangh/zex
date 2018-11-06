const tap = require("tap");

const accountFixtures = require("./accountFixtures");
const { deployContract, getLatestContractAddress } = require("../src/utils");
const { USER_1 } = require("../src/zilliqa-node");
const { initContract } = require("../src/zex-transitions");

const userPrivateKey = accountFixtures[USER_1].privateKey;

tap.beforeEach(async function() {
  const txnHash = await deployContract();
  console.log("Contract deployed to kaya: " + txnHash);
});

tap.test("initContract", async function() {
  const contractAddress = await getLatestContractAddress();
  const txHash = await initContract(userPrivateKey, contractAddress);
  console.log(txHash);
});
