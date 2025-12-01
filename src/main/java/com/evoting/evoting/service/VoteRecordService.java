package com.evoting.evoting.service;

import com.evoting.evoting.model.VoteRecord;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.repository.VoteRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoteRecordService {

    private final VoteRecordRepository voteRecordRepository;

    public VoteRecord recordVote(Voter voter, Election election, String blockchainTxHash) {
        VoteRecord record = new VoteRecord();
        record.setVoter(voter);
        record.setElection(election);
        record.setBlockchainTxHash(blockchainTxHash);
        record.setVoteTime(LocalDateTime.now());
        return voteRecordRepository.save(record);
    }

    public boolean hasAlreadyVoted(Voter voter) {
        return voteRecordRepository.existsByVoter(voter);
    }

    public long countVotes(Election election) {
        return voteRecordRepository.countByElection(election);
    }

}
