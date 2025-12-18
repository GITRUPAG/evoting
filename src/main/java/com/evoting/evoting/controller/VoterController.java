package com.evoting.evoting.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.evoting.evoting.dto.CastVoteRequest;
import com.evoting.evoting.dto.LoginRequest;
import com.evoting.evoting.dto.LoginResponse;
import com.evoting.evoting.dto.VoteHistoryResponse;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.repository.VoterRepository;
import com.evoting.evoting.security.JwtUtil;
import com.evoting.evoting.service.BlockchainService;
import com.evoting.evoting.service.CandidateService;
import com.evoting.evoting.service.ElectionService;
import com.evoting.evoting.service.EmailService;
import com.evoting.evoting.service.VoteOtpService;
import com.evoting.evoting.service.VoteRecordService;
import com.evoting.evoting.service.VoterService;


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
    private final CandidateService candidateService;



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
            token
    );

    return ResponseEntity.ok(response);
}


// ---------------------------------------------------------
    // SEND OTP FOR VOTING
    // ---------------------------------------------------------
    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestParam Long voterId) {
        try {
            Voter voter = voterService.getById(voterId);

            String otp = emailService.generateOTP();
            voteOtpService.createOtp(voter, otp);

            emailService.sendOtpEmail(voter.getEmail(), otp);

            return ResponseEntity.ok("OTP sent to your email!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to send OTP: " + e.getMessage());
        }
    }

    // ---------------------------------------------------------
    // VERIFY OTP AND CAST VOTE
    // ---------------------------------------------------------
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody CastVoteRequest req) {

        System.out.println("\n\n[VERIFY-OTP] STARTING");

        Voter voter = voterService.getById(req.getVoterId());
        Election election = electionService.getElectionById(req.getElectionId());
        Candidate candidate = candidateService.getCandidateById(req.getCandidateId());

        System.out.println("[VERIFY-OTP] Loaded voter=" + voter.getId()
                + " election=" + election.getId()
                + " candidate=" + candidate.getId());

        // STEP 1 — OTP validation
        if (!voteOtpService.verifyOtp(voter, req.getOtp())) {
            System.out.println("[VERIFY-OTP] INVALID OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired OTP!");
        }

        System.out.println("[VERIFY-OTP] OTP OK");

        // STEP 2 — Check duplicate voting
        if (voteRecordService.hasAlreadyVoted(voter, election)) {
            System.out.println("[VERIFY-OTP] ALREADY VOTED");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You have already voted!");
        }

        // STEP 3 — Cast vote on blockchain
        System.out.println("[VERIFY-OTP] Casting blockchain vote...");
        String txHash = blockchainService.castVote(
    election.getId(),
    candidate.getId()
);
        System.out.println("[VERIFY-OTP] Blockchain TxHash = " + txHash);

        // STEP 4 — Save vote record
        voteRecordService.recordVote(voter, election, candidate, txHash);
        System.out.println("[VERIFY-OTP] Vote record saved!");

        
        System.out.println("[VERIFY-OTP] Voter marked as voted");

        // STEP 6 — Remove OTP
        voteOtpService.deleteOtp(voter);

        return ResponseEntity.ok("Vote successfully cast! TxHash: " + txHash);
    }

    // ---------------------------------------------------------
    // OPTIONAL: CAST VOTE WITHOUT OTP (testing only)
    // ---------------------------------------------------------
    @PostMapping("/cast-vote")
    public ResponseEntity<String> castVote(@RequestBody CastVoteRequest req) {

        System.out.println("\n\n[CAST-VOTE] STARTING");

        Voter voter = voterService.getById(req.getVoterId());
        Election election = electionService.getElectionById(req.getElectionId());
        Candidate candidate = candidateService.getCandidateById(req.getCandidateId());

        System.out.println("[CAST-VOTE] Loaded voter=" + voter.getId()
                + " election=" + election.getId()
                + " candidate=" + candidate.getId());

        if (voteRecordService.hasAlreadyVoted(voter, election)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("You have already voted!");
        }

        String txHash = blockchainService.castVote(
    election.getId(),
    candidate.getId()
);

        voteRecordService.recordVote(voter, election, candidate, txHash);
        

        return ResponseEntity.ok("Vote successfully recorded! TxHash: " + txHash);
    }


    @GetMapping("/profile/{id}")
public ResponseEntity<?> getProfile(@PathVariable Long id) {

    Voter voter = voterService.getById(id);

    return ResponseEntity.ok(voter);
}

@PostMapping("/vote-history")
public ResponseEntity<?> getVoteHistory(@RequestParam Long voterId) {

    try {
        List<VoteHistoryResponse> history = voteRecordService.getVoteHistory(voterId);
        return ResponseEntity.ok(history);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Failed to fetch history: " + e.getMessage());
    }
}


}
