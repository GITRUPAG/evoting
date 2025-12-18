package com.evoting.evoting.repository;

import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.model.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    List<Candidate> findByElection(Election election);

    List<Candidate> findByElectionId(Long electionId);

}
