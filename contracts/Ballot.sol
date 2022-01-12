// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Ballot {
    struct Voter {
        uint256 voterId;
        bool voted;
    }

    struct Candidate {
        uint256 candidateId;
        string name;
        uint256 voteTally;
    }

    mapping(address => bool) public voters;
    mapping(uint256 => Candidate) public candidates;

    uint256 public candidatesCount;

    function addCandidate(string memory _name) external {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint256 _candidateId) public {
        voters[msg.sender] = true;
        candidates[_candidateId].voteTally++;
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidatesCount;
    }

    function readVoteTally(uint256 _candidateId)
        external
        view
        returns (uint256)
    {
        return candidates[_candidateId].voteTally;
    }
}
