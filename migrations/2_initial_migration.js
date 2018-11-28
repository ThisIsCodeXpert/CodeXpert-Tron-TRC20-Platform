var TRC20 = artifacts.require("./TRC20.sol");

module.exports = function(deployer) {

  deployer.deploy(TRC20);

};
