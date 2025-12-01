// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    mapping(string => uint256) public votes;
    mapping(address => bool) public hasVoted;

    function castVote(string memory candidate) public {
        require(!hasVoted[msg.sender], "You already voted!");
        votes[candidate]++;
        hasVoted[msg.sender] = true;
    }

    function getVotes(string memory candidate) public view returns (uint256) {
        return votes[candidate];
    }
}
