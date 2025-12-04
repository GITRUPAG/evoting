package com.evoting.evoting.repository;

import com.evoting.evoting.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    long countByElectionId(Long electionId);

    long countByCandidateId(Long candidateId);

    boolean existsByVoterIdAndElectionId(Long voterId, Long electionId);

    List<Vote> findByElectionId(Long electionId);
}
