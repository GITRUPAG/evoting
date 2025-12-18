// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    // votes[electionId][candidateId]
    mapping(uint256 => mapping(uint256 => uint256)) public votes;

    // hasVoted[electionId][voterAddress]
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    function castVote(uint256 electionId, uint256 candidateId) public {
        require(!hasVoted[electionId][msg.sender], "You already voted!");

        votes[electionId][candidateId] += 1;
        hasVoted[electionId][msg.sender] = true;
    }

    function getVotes(uint256 electionId, uint256 candidateId)
        public
        view
        returns (uint256)
    {
        return votes[electionId][candidateId];
    }
}
