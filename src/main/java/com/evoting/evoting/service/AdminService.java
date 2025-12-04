package com.evoting.evoting.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.evoting.evoting.dto.CandidateVoteStatsDto;
import com.evoting.evoting.dto.ElectionVoteSummaryDto;
import com.evoting.evoting.dto.StatsDto;
import com.evoting.evoting.model.Admin;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.repository.AdminRepository;
import com.evoting.evoting.repository.CandidateRepository;
import com.evoting.evoting.repository.ElectionRepository;
import com.evoting.evoting.repository.VoteRecordRepository;
import com.evoting.evoting.repository.VoterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final ElectionRepository electionRepo;
    private final VoterRepository voterRepo;
    private final VoteRecordRepository voteRecordRepo; // ✅ Correct
    private final CandidateRepository candidateRepo;

    public Admin register(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }
        return adminRepository.save(admin);
    }

    public Admin login(String username, String password) {
    Admin admin = adminRepository.findByUsername(username)
            .filter(a -> a.getPassword().equals(password))
            .orElseThrow(() -> new RuntimeException("Invalid admin credentials!"));

    return admin;
}


    // --------------------------- 1. OVERALL STATS ---------------------------
    public StatsDto getOverallStats() {

        StatsDto dto = new StatsDto();

        long totalElections = electionRepo.count();
        long active = electionRepo.countByStatus("Active");
        long completed = electionRepo.countByStatus("Completed");

        long totalVoters = voterRepo.count();
        long totalVotes = voteRecordRepo.count();  // ✅ FIXED

        double turnout = (totalVoters == 0)
                ? 0
                : (totalVotes * 100.0) / totalVoters;

        dto.setTotalElections(totalElections);
        dto.setActiveElections(active);
        dto.setCompletedElections(completed);
        dto.setTotalVoters(totalVoters);
        dto.setVotesCast(totalVotes);
        dto.setTurnoutPercentage(Math.round(turnout * 100.0) / 100.0);

        return dto;
    }

    // --------------------------- 2. ELECTION VOTE SUMMARY ---------------------------
    public List<ElectionVoteSummaryDto> getElectionsVoteSummary() {

        return electionRepo.findAll().stream().map(election -> {

            long votes = voteRecordRepo.countByElectionId(election.getId());  // ✅ FIXED

            ElectionVoteSummaryDto dto = new ElectionVoteSummaryDto();
            dto.setElectionId(election.getId());
            dto.setElectionTitle(election.getTitle());
            dto.setTotalVotes(votes);

            return dto;
        }).collect(Collectors.toList());
    }

    // --------------------------- 3. CANDIDATE VOTE STATS ---------------------------
    public List<CandidateVoteStatsDto> getCandidateVoteStats(Long electionId) {

        List<Candidate> candidates = candidateRepo.findByElectionId(electionId);

        return candidates.stream().map(c -> {
            long votes = voteRecordRepo.countByElectionIdAndCandidateId(electionId, c.getId());

            CandidateVoteStatsDto dto = new CandidateVoteStatsDto();
            dto.setCandidateName(c.getName());
            dto.setVotes(votes);

            return dto;
        }).collect(Collectors.toList());
    }
}
