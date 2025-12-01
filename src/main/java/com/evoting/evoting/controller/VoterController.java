package com.evoting.evoting.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.evoting.evoting.dto.LoginRequest;
import com.evoting.evoting.dto.LoginResponse;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.VoteOtp;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.repository.VoterRepository;
import com.evoting.evoting.security.JwtUtil;
import com.evoting.evoting.service.BlockchainService;
import com.evoting.evoting.service.ElectionService;
import com.evoting.evoting.service.EmailService;
import com.evoting.evoting.service.VoteOtpService;
import com.evoting.evoting.service.VoteRecordService;
import com.evoting.evoting.service.VoterService;
import com.evoting.evoting.security.SecurityConfig;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/voter")
@RequiredArgsConstructor
public class VoterController {

    private final VoterService voterService;
    private final ElectionService electionService;
    private final VoteRecordService voteRecordService;
    private final BlockchainService blockchainService;
    private final EmailService emailService;
    private final VoteOtpService voteOtpService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final VoterRepository voterRepository;


    @PostMapping("/register")
    public Voter register(@RequestBody Voter voter) {
        return voterService.register(voter);
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )
    );

    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    String token = jwtUtil.generateToken(userDetails);

    Voter voter = voterRepository.findByEmail(request.getEmail()).orElse(null);

    LoginResponse response = new LoginResponse(
            voter.getId(),
            voter.getName(),
            voter.getEmail(),
            voter.isHasVoted(),
            token
    );

    return ResponseEntity.ok(response);
}



    @PostMapping("/cast-vote")
    public String castVote(@RequestParam Long voterId,
                           @RequestParam Long electionId,
                           @RequestParam String candidateName) {

        Voter voter = voterService.getById(voterId);
        Election election = electionService.getElectionById(electionId);

        // ✅ Optional: assign voter to this election if not assigned
        if (voter.getElection() == null) {
            voterService.assignToElection(voter, election);
        }

        // ✅ Prevent double voting
        if (voteRecordService.hasAlreadyVoted(voter)) {
            return "You have already voted!";
        }

        // ✅ Send vote to blockchain
        String txHash = blockchainService.castVote(candidateName);

        if (txHash == null) {
            return "Blockchain transaction failed!";
        }

        // ✅ Save transaction metadata
        voteRecordService.recordVote(voter, election, txHash);

        // ✅ Mark voter as voted in DB
        voterService.markAsVoted(voter);

        return "✅ Vote successfully recorded on blockchain! TxHash: " + txHash;
    }

    @PostMapping("/request-otp")
public String requestOtp(@RequestParam Long voterId) {
    Voter voter = voterService.getById(voterId);

    // Generate OTP
    String otp = emailService.generateOTP();

    // Save OTP with expiry (5 mins)
    VoteOtp voteOtp = voteOtpService.createOtp(voter, otp);

    // Send OTP via email
    emailService.sendOtpEmail(voter.getEmail(), otp);

    return "OTP sent to your email!";
}

@PostMapping("/verify-otp")
public String verifyOtp(@RequestParam Long voterId,
                        @RequestParam String otp,
                        @RequestParam Long electionId,
                        @RequestParam String candidateName) {

    Voter voter = voterService.getById(voterId);
    Election election = electionService.getElectionById(electionId);

    // Check OTP
    if (!voteOtpService.verifyOtp(voter, otp)) {
        return "Invalid or expired OTP!";
    }

    // Prevent double voting
    if (voteRecordService.hasAlreadyVoted(voter)) {
        return "You have already voted!";
    }

    // Cast vote on blockchain
    String txHash = blockchainService.castVote(candidateName);

    // Save vote record
    voteRecordService.recordVote(voter, election, txHash);
    voterService.markAsVoted(voter);

    // Delete used OTP
    voteOtpService.deleteOtp(voter);

    return "Vote successfully cast! TxHash: " + txHash;
}

}
