package com.evoting.evoting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evoting.evoting.dto.CandidateProfileDto;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.service.CandidateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
@CrossOrigin
public class CandidateController {

    private final CandidateService candidateService;

    // ✅ Get all candidates
    @GetMapping("/all")
    public List<Candidate> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    // ✅ Get candidate by ID
    @GetMapping("/{id}")
    public Candidate getCandidateById(@PathVariable Long id) {
        return candidateService.getCandidateById(id);
    }

    @GetMapping("/profile/{id}")
public CandidateProfileDto getCandidateProfile(@PathVariable Long id) {
    return candidateService.getCandidateProfile(id);
}

@PutMapping("/update/{id}")
public Candidate updateCandidate(
        @PathVariable Long id,
        @RequestBody Candidate candidateData
) {
    return candidateService.updateCandidate(id, candidateData);
}

@DeleteMapping("/delete/{id}")
public String deleteCandidate(@PathVariable Long id) {
    candidateService.deleteCandidate(id);
    return "Candidate deleted successfully";
}



}
