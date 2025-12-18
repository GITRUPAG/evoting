package com.evoting.evoting.controller;

import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.service.ElectionService;
import com.evoting.evoting.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/election")
@RequiredArgsConstructor
@CrossOrigin
public class ElectionController {

    private final ElectionService electionService;
    private final CandidateService candidateService;

    @GetMapping("/all")
    public List<Election> getAllElections() {
        return electionService.getAllElections();
    }

    @GetMapping("/{id}")
    public Election getElection(@PathVariable Long id) {
        return electionService.getElectionById(id);
    }

    @GetMapping("/{id}/candidates")
    public List<Candidate> getCandidates(@PathVariable Long id) {
        Election election = electionService.getElectionById(id);
        return candidateService.getCandidatesByElection(election);
    }
}
