const Ballot = artifacts.require("Ballot");

module.exports = function (deployer, network, accounts) {
  const candidateNameArray = ["Candidate 1", "Candidate 2"];
  const proposalName = "truffle-test";
  const addressArray = [accounts[1], accounts[2]];

  deployer.deploy(Ballot, candidateNameArray, proposalName, addressArray);
};
