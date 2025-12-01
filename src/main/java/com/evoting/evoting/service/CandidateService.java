package com.evoting.evoting.service;

import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public Candidate addCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public List<Candidate> getCandidatesByElection(Election election) {
        return candidateRepository.findByElection(election);
    }
}
