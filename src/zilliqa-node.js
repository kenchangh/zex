global.fetch = require("node-fetch");
const { Zilliqa } = require("zilliqa-js");

const nodeUrl = "http://localhost:4200";
const zilliqa = new Zilliqa({ nodeUrl });
const node = zilliqa.getNode();

const accountFixtures = require("../test/accountFixtures");

const OWNER = "7bb3b0e8a59f3f61d9bff038f4aeb42cae2ecce8";
const USER_1 = "d90f2e538ce0df89c8273cad3b63ec44a3c4ed82";

module.exports = {
  zilliqa,
  node,
  accountFixtures,
  OWNER,
  USER_1
};
