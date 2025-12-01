package com.evoting.evoting.repository;

import com.evoting.evoting.model.VoteRecord;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.model.Election;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {

    Optional<VoteRecord> findByVoter(Voter voter);

    boolean existsByVoter(Voter voter);

    long countByElection(Election election);
}
