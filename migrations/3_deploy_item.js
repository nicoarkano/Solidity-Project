var Item = artifacts.require("./Item.sol");
var ItemManager = artifacts.require("./ItemManager.sol");

module.exports = function(deployer) {
  deployer.deploy(Item)
  }
module.exports = function(deployer) {
  deployer.deploy(ItemManager)
  }
