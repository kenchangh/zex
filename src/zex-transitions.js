const { createTransaction } = require("./utils");

module.exports = {
  initContract,
  makeOrder,
  approveSpend
};

async function initContract(privateKey, contractAddress) {
  const fname = "initContract";

  const params = [
    {
      vname: "thisContractAddress",
      value: `0x${contractAddress}`,
      type: "ByStr20"
    }
  ];
  const txHash = await createTransaction(
    "./ZEX.scilla",
    privateKey,
    fname,
    0,
    params
  );
  return txHash;
}

async function makeOrder(privateKey, tokenAddress, orderType, amount, price) {
  const fname = "makeOrder";

  const params = [
    {
      vname: "tokenAddress",
      value: `0x${tokenAddress}`,
      type: "ByStr20"
    },
    {
      vname: "orderType",
      value: `${orderType}`,
      type: "Uint32"
    },
    {
      vname: "amount",
      value: `${amount}`,
      type: "Uint128"
    },
    {
      vname: "price",
      value: `${price}`,
      type: "Uint128"
    }
  ];
  const txHash = await createTransaction(
    "./ZEX.scilla",
    privateKey,
    fname,
    price * amount,
    params
  );
  return txHash;
}

async function approveSpend(privateKey, spender, tokens) {
  const fname = "Approve";

  const params = [
    {
      vname: "spender",
      value: `0x${spender}`,
      type: "ByStr20"
    },
    {
      vname: "tokens",
      value: `${tokens}`,
      type: "Uint128"
    }
  ];
  const txHash = await createTransaction(
    "./FungibleToken.scilla",
    privateKey,
    fname,
    0,
    params
  );
  return txHash;
}
