var Ballot = artifacts.require(" ./Ballot.sol");

contract("Ballot", (accounts) => {
  it("initializes with two candidates", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        return instance.candidatesCount();
      })
      .then(function (count) {
        assert.equal(count, 2);
      });
  });

  it("initializes with a valid string ballot proposal", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        return instance.proposalName();
      })
      .then(function (name) {
        const operand = typeof name;
        assert.equal(operand, "string");
      });
  });

  it("initializes with a valid ethereum addresses", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        return ballotInstance.excludedAddresses(accounts[1]);
      })
      .then(function (address1) {
        const ethRegex = /^0x[a-fA-F0-9]{40}$/;
        const isEthValid = ethRegex.test(accounts[1]);
        assert.equal(address1, true, "candidate 1 account is excluded");
        assert.equal(isEthValid, true, "candidate 1 eth address is valid");
        return ballotInstance.excludedAddresses(accounts[2]);
      })
      .then(function (address2) {
        assert.equal(address2, true, "candidate 2 account is excluded");
        const ethRegex = /^0x[a-fA-F0-9]{40}$/;
        const isEthValid = ethRegex.test(accounts[2]);
        assert.equal(isEthValid, true, "candidate 2 eth address is valid");
      });
  });

  it("initializes candidates with correct base values", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        return ballotInstance.candidates(0);
      })
      .then(function (candidate) {
        assert.equal(candidate[0], 0, "contains the correct id");
        assert.equal(candidate[1], "Candidate 1", "contains the correct name");
        assert.equal(candidate[2], 0, "contains the correct votes count");
        return ballotInstance.candidates(1);
      })
      .then(function (candidate) {
        assert.equal(candidate[0], 1, "contains the correct id");
        assert.equal(candidate[1], "Candidate 2", "contains the correct name");
        assert.equal(candidate[2], 0, "contains the correct votes count");
      });
  });

  it("stops contract deployer (chairman) from casting a vote", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        candidateId = 0;
        return ballotInstance.vote(candidateId, { from: accounts[0] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
        return ballotInstance.excludedAddresses(accounts[0]);
      })
      .then(function (chairmanAccount) {
        assert.equal(chairmanAccount, true, "chairman is excluded from voting");
        return ballotInstance.candidates(0);
      })
      .then(function (candidate1) {
        const voteTally = candidate1[2];
        assert.equal(voteTally, 0, "candidate 1 did not receive any votes");
      });
  });

  it("stops a candidate from casting a vote for themselves ", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        candidateId = 0;
        return ballotInstance.vote(candidateId, { from: accounts[1] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
        return ballotInstance.excludedAddresses(accounts[1]);
      })
      .then(function (candidateAddress) {
        assert.equal(
          candidateAddress,
          true,
          "Candidate 1 is excluded from voting"
        );
        return ballotInstance.candidates(0);
      })
      .then(function (candidate1) {
        const voteTally = candidate1[2];
        assert.equal(voteTally, 0, "candidate 1 did not receive any votes");
      });
  });

  it("allows a valid voter to send a valid vote", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        candidateId = 0;
        return ballotInstance.vote(candidateId, { from: accounts[3] });
      })
      .then(function () {
        return ballotInstance.voters(accounts[3]);
      })
      .then(function (voted) {
        assert(voted, true, "the voter was marked as voted");
        return ballotInstance.candidates(candidateId);
      })
      .then(function (candidate) {
        const voteTally = candidate[2];
        assert.equal(voteTally, 1, "increments the candidate's vote count");
      });
  });

  it("throws an exception for casting a vote for invalid candidates", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        return ballotInstance.vote(99, { from: accounts[4] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
        return ballotInstance.candidates(0);
      })
      .then(function (candidate1) {
        const voteTally = candidate1[2];
        assert.equal(voteTally, 1, "candidate 1 did not receive any votes");
        return ballotInstance.candidates(1);
      })
      .then(function (candidate2) {
        const voteTally = candidate2[2];
        assert.equal(voteTally, 0, "candidate 2 did not receive any votes");
      });
  });

  it("throws an exception for double voting from a voter", async function () {
    return Ballot.deployed()
      .then(function (instance) {
        ballotInstance = instance;
        candidateId = 1;
        return ballotInstance.vote(candidateId, { from: accounts[5] });
      })
      .then(function () {
        return ballotInstance.voters(accounts[5]);
      })
      .then(function (voted) {
        assert(voted, true, "the voter was marked as voted");
        return ballotInstance.candidates(candidateId);
      })
      .then(function (candidate) {
        const voteTally = candidate[2];
        assert.equal(voteTally, 1, "accepts first vote");
        return ballotInstance.vote(candidateId, { from: accounts[5] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
        return ballotInstance.candidates(0);
      })
      .then(function (candidate1) {
        const voteTally = candidate1[2];
        assert.equal(voteTally, 1, "candidate 1 did not receive any votes");
        return ballotInstance.candidates(candidateId);
      })
      .then(function (candidate2) {
        const voteTally = candidate2[2];
        assert.equal(voteTally, 1, "candidate 2 did not receive any votes");
      });
  });
});
