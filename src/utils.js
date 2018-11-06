const fs = require("fs");
const { promisify } = require("util");
const BN = require("bn.js");
const { OWNER, node, accountFixtures, zilliqa } = require("./zilliqa-node");

const CONTRACT_PATH = "./ZEX.scilla";
const ZERO_ADDRESS = "0000000000000000000000000000000000000000";

module.exports = {
  createTransaction,
  deployContract,
  getLatestContractAddress
};

function readContractFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(CONTRACT_PATH, function(err, fileContent) {
      if (err) {
        reject(err);
      } else {
        resolve(fileContent.toString());
      }
    });
  });
}

async function getLatestContractAddress() {
  const contractsResponse = await promisify(node.getSmartContracts)({
    address: OWNER
  });
  const contracts = contractsResponse.result;
  return contracts[contracts.length - 1].address;
}

async function getBalance(address) {
  const balanceResponse = await promisify(node.getBalance)({ address });
  return balanceResponse.result;
  const { nonce } = balanceResponse.result;
}

async function createTransaction(
  privateKey,
  fname,
  amount,
  params,
  gasLimit = 2000
) {
  const address = zilliqa.util.getAddressFromPrivateKey(privateKey);
  const contractAddress = await getLatestContractAddress();
  const balanceResult = await getBalance(address);
  const { nonce } = balanceResult;

  let message = {
    _tag: fname,
    _amount: `${amount}`,
    _sender: "0x" + address,
    params
  };
  message = JSON.stringify(message);

  const txnDetails = {
    version: 0,
    nonce: nonce + 1,
    to: contractAddress,
    amount: new BN(0),
    gasPrice: 1,
    gasLimit,
    data: message
  };

  // sign the transaction using util methods
  let txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);

  try {
    const response = await promisify(node.createTransaction)(txn);
    return response.result;
  } catch (err) {
    console.log(err.message);
  }
}

async function deployContract() {
  // Deploy a new contract for each test
  const contractCode = await readContractFile();
  const initParams = [
    {
      vname: "contractOwner",
      type: "ByStr20",
      value: "0x" + OWNER
    },
    {
      vname: "_creation_block",
      type: "BNum",
      value: "1"
    }
  ];
  const balanceResponse = await promisify(node.getBalance)({ address: OWNER });
  const { nonce } = balanceResponse.result;

  const txnDetails = {
    version: 0,
    nonce: nonce + 1,
    to: ZERO_ADDRESS,
    amount: new BN(200000),
    gasPrice: 1,
    gasLimit: 2000,
    code: contractCode,
    data: JSON.stringify(initParams).replace(/\\"/g, '"')
  };
  const { privateKey } = accountFixtures[OWNER];
  const txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
  const createTransactionResponse = await promisify(node.createTransaction)(
    txn
  );
  return createTransactionResponse.result;
}
