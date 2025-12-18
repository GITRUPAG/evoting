package com.evoting.evoting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.evoting.evoting.dto.CandidateProfileDto;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.repository.CandidateRepository;

import lombok.RequiredArgsConstructor;

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

    public List<Candidate> getAllCandidates() {
    return candidateRepository.findAll();
}

public Candidate getCandidateById(Long id) {
    return candidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
}

public CandidateProfileDto getCandidateProfile(Long id) {

    Candidate candidate = candidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));

    CandidateProfileDto dto = new CandidateProfileDto();
    dto.setId(candidate.getId());
    dto.setName(candidate.getName());
    dto.setParty(candidate.getParty());
    dto.setPosition(candidate.getPosition());
    dto.setBio(candidate.getBio());
    dto.setImageUrl(candidate.getImageUrl());

    if (candidate.getElection() != null) {
        dto.setElectionId(candidate.getElection().getId());
        dto.setElectionTitle(candidate.getElection().getTitle());
    }

    return dto;
}

public Candidate updateCandidate(Long id, Candidate updatedData) {

    Candidate existing = candidateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));

    // Update fields
    existing.setName(updatedData.getName());
    existing.setParty(updatedData.getParty());
    existing.setPosition(updatedData.getPosition());
    existing.setBio(updatedData.getBio());
    existing.setImageUrl(updatedData.getImageUrl());

    // Update election if sent
    if (updatedData.getElection() != null) {
        existing.setElection(updatedData.getElection());
    }

    return candidateRepository.save(existing);
}

public void deleteCandidate(Long id) {
    candidateRepository.deleteById(id);
}




}
