package com.evoting.evoting.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.evoting.evoting.dto.VoteHistoryResponse;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.VoteRecord;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.repository.CandidateRepository;
import com.evoting.evoting.repository.ElectionRepository;
import com.evoting.evoting.repository.VoteRecordRepository;
import com.evoting.evoting.repository.VoterRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class VoteRecordService {

    private final VoteRecordRepository voteRecordRepository;
    private final VoterRepository voterRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;

    public VoteRecord recordVote(Voter voter, Election election, Candidate candidate, String blockchainTxHash) {

        System.out.println("[VoteRecordService] recordVote START");

        // load managed entities
        Voter managedVoter = voterRepository.findById(voter.getId())
                .orElseThrow(() -> new RuntimeException("Voter not found: " + voter.getId()));
        Election managedElection = electionRepository.findById(election.getId())
                .orElseThrow(() -> new RuntimeException("Election not found: " + election.getId()));
        Candidate managedCandidate = candidateRepository.findById(candidate.getId())
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidate.getId()));

        VoteRecord record = new VoteRecord();
        record.setVoter(managedVoter);
        record.setElection(managedElection);
        record.setCandidate(managedCandidate);
        record.setBlockchainTxHash(blockchainTxHash);
        record.setVoteTime(LocalDateTime.now());

        System.out.println("[VoteRecordService] Saving vote record...");
        VoteRecord saved = voteRecordRepository.saveAndFlush(record);

        System.out.println("[VoteRecordService] VoteRecord INSERTED with ID=" + saved.getId());

        return saved;
    }

    public boolean hasAlreadyVoted(Voter voter, Election election) {
    boolean exists = voteRecordRepository.existsByVoterIdAndElectionId(
            voter.getId(),
            election.getId()
    );
    System.out.println("[VoteRecordService] hasAlreadyVoted voterId=" 
        + voter.getId() + " electionId=" + election.getId() + " -> " + exists);
    
    return exists;
}


    public long countVotes(Election election) {
        return voteRecordRepository.countByElection(election);
    }

    public List<VoteHistoryResponse> getVoteHistory(Long voterId) {
    List<Election> elections = voteRecordRepository.findElectionsVotedByVoter(voterId);

    return elections.stream()
            .map(e -> new VoteHistoryResponse(
                    e.getId(),
                    e.getTitle(),
                    "Voted"
            ))
            .toList();
}

}
