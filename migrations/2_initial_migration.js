var SmartContract = artifacts.require("./SmartContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SmartContract);
};
