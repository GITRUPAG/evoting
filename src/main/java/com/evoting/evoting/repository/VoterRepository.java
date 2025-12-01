package com.evoting.evoting.repository;

import com.evoting.evoting.model.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoterRepository extends JpaRepository<Voter, Long> {

    Optional<Voter> findByEmail(String email);

    boolean existsByEmail(String email);
}
