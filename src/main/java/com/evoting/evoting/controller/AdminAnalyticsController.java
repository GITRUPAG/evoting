package com.evoting.evoting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.evoting.evoting.dto.*;
import com.evoting.evoting.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminAnalyticsController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public StatsDto getStats() {
        return adminService.getOverallStats();
    }

    @GetMapping("/elections/vote-summary")
    public List<ElectionVoteSummaryDto> getElectionVoteSummary() {
        return adminService.getElectionsVoteSummary();
    }

    @GetMapping("/election/{id}/vote-stats")
    public List<CandidateVoteStatsDto> getCandidateVoteStats(@PathVariable Long id) {
        return adminService.getCandidateVoteStats(id);
    }
}
