package com.evoting.evoting.service;

import com.evoting.evoting.model.Election;
import com.evoting.evoting.repository.ElectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;

    public Election createElection(Election election) {
        return electionRepository.save(election);
    }

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public Election getElectionById(Long id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));
    }

    public Election updateStatus(Long id, String status) {
        Election election = getElectionById(id);
        election.setStatus(status);
        return electionRepository.save(election);
    }
}
