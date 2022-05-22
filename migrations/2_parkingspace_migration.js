const ParkingSpace = artifacts.require("ParkingSpace");

module.exports = function (deployer) {
  deployer.deploy(ParkingSpace);
};

