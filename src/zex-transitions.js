const { createTransaction } = require("./utils");

module.exports = {
  initContract
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
  const txHash = await createTransaction(privateKey, "initContract", 0, params);
  return txHash;
}
