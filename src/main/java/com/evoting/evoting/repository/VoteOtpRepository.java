package com.evoting.evoting.repository;

import com.evoting.evoting.model.VoteOtp;
import com.evoting.evoting.model.Voter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteOtpRepository extends JpaRepository<VoteOtp, Long> {

    Optional<VoteOtp> findByVoter(Voter voter);

    void deleteByVoter(Voter voter);
}
