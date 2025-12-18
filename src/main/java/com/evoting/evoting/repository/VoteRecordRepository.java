package com.evoting.evoting.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.VoteRecord;
import com.evoting.evoting.model.Voter;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {

    Optional<VoteRecord> findByVoter(Voter voter);

    boolean existsByVoter(Voter voter);

    boolean existsByVoterId(Long voterId);  // ⭐ critical fix

    long countByElection(Election election);

    long countByCandidateId(Long candidateId);

    long countByElectionId(Long electionId);

    boolean existsByVoterAndElection(Voter voter, Election election);

    long countByElectionIdAndCandidateId(Long electionId, Long candidateId);

    boolean existsByVoterIdAndElectionId(Long voterId, Long electionId);

    @Query("SELECT vr.election FROM VoteRecord vr WHERE vr.voter.id = :voterId")
List<Election> findElectionsVotedByVoter(Long voterId);


}
