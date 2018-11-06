const fs = require("fs");
const { promisify } = require("util");
const BN = require("bn.js");
const { OWNER, node, accountFixtures, zilliqa } = require("./zilliqa-node");

const ZEX_CONTRACT_PATH = "./ZEX.scilla";
const TOKEN_CONTRACT_PATH = "./FungibleToken.scilla";
const ZERO_ADDRESS = "0000000000000000000000000000000000000000";

module.exports = {
  createTransaction,
  deployContract,
  deployZEXContract,
  deployTokenContract,
  getLatestDeployedContract
};

function readContractFile(contractPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(contractPath, function(err, fileContent) {
      if (err) {
        reject(err);
      } else {
        resolve(fileContent.toString());
      }
    });
  });
}

async function getLatestDeployedContract(contractPath) {
  const address = OWNER;
  const contractsResponse = await promisify(node.getSmartContracts)({
    address
  });
  const contracts = contractsResponse.result.reverse();
  for (let contract of contracts) {
    const foundCode = await promisify(node.getSmartContractCode)({
      address: contract.address
    });
    const matching =
      contractPath === ZEX_CONTRACT_PATH ? "ZEX" : "FungibleToken";
    if (foundCode.result.code.indexOf("ZEX") !== -1) {
      return contract;
    }
  }
}

async function getBalance(address) {
  const balanceResponse = await promisify(node.getBalance)({ address });
  return balanceResponse.result;
  const { nonce } = balanceResponse.result;
}

async function createTransaction(
  contractPath,
  privateKey,
  fname,
  amount,
  params,
  gasLimit = 2000
) {
  const address = zilliqa.util.getAddressFromPrivateKey(privateKey);
  const contract = await getLatestDeployedContract(contractPath);
  const contractAddress = contract.address;
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
    console.error(err.message);
  }
}

async function deployZEXContract() {
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
  const amount = 200000;
  txHash = await deployContract(ZEX_CONTRACT_PATH, initParams, amount);
  return txHash;
}

async function deployTokenContract() {
  const initParams = [
    {
      vname: "owner",
      type: "ByStr20",
      value: "0x" + OWNER
    },
    {
      vname: "total_tokens",
      type: "Uint128",
      value: "1000000000"
    },
    {
      vname: "_creation_block",
      type: "BNum",
      value: "1"
    }
  ];
  txHash = await deployContract(TOKEN_CONTRACT_PATH, initParams, 0);
  return txHash;
}

async function deployContract(contractPath, initParams, amount) {
  // Deploy a new contract for each test
  const contractCode = await readContractFile(contractPath);

  const balanceResponse = await promisify(node.getBalance)({ address: OWNER });
  const { nonce } = balanceResponse.result;

  const txnDetails = {
    version: 0,
    nonce: nonce + 1,
    to: ZERO_ADDRESS,
    amount: new BN(amount),
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
