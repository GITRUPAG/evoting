package com.evoting.evoting.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.Voter;
import com.evoting.evoting.repository.VoterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoterService {

    private final VoterRepository voterRepository;
    private final PasswordEncoder passwordEncoder;


    public Voter register(Voter voter) {
        if (voterRepository.existsByEmail(voter.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        // encode password BEFORE saving
        voter.setPassword(passwordEncoder.encode(voter.getPassword()));

        return voterRepository.save(voter);
    }


    public Voter login(String email, String password) {
        Optional<Voter> found = voterRepository.findByEmail(email);

        if (found.isEmpty() || !found.get().getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password!");
        }
        return found.get();
    }

    public boolean hasVoted(Voter voter) {
        return voter.isHasVoted();
    }

    public void markAsVoted(Voter voter) {
        voter.setHasVoted(true);
        voterRepository.save(voter);
    }

    public Voter assignToElection(Voter voter, Election election) {
        voter.setElection(election);
        return voterRepository.save(voter);
    }

    public Voter getById(Long id) {
    return voterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Voter not found with id: " + id));
}

}
