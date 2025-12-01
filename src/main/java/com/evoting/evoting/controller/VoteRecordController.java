package com.evoting.evoting.controller;

import com.evoting.evoting.model.VoteRecord;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.service.VoteRecordService;
import com.evoting.evoting.service.ElectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin
public class VoteRecordController {

    private final VoteRecordService voteRecordService;
    private final ElectionService electionService;

    @GetMapping("/count/{electionId}")
    public String getVoteCount(@PathVariable Long electionId) {
        Election election = electionService.getElectionById(electionId);
        long count = voteRecordService.countVotes(election);
        return "Total votes: " + count;
    }
}
