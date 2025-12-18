package com.evoting.evoting.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.evoting.evoting.model.VoteOtp;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.repository.VoteOtpRepository;

import jakarta.transaction.Transactional; // ✅ IMPORTANT
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteOtpService {

    private final VoteOtpRepository voteOtpRepository;

   @Transactional
public VoteOtp createOtp(Voter voter, String otp) {

    VoteOtp existing = voteOtpRepository.findByVoter(voter).orElse(null);

    if (existing != null) {
        existing.setOtp(otp);
        existing.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        return voteOtpRepository.save(existing);
    }

    VoteOtp voteOtp = new VoteOtp();
    voteOtp.setVoter(voter);
    voteOtp.setOtp(otp);
    voteOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

    return voteOtpRepository.save(voteOtp);
}

    public boolean verifyOtp(Voter voter, String otp) {
        return voteOtpRepository.findByVoter(voter)
                .filter(v -> v.getOtp().equals(otp)
                        && v.getExpiryTime().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    @Transactional
    public void deleteOtp(Voter voter) {
        voteOtpRepository.deleteByVoter(voter);
    }
}
