package com.evoting.evoting.controller;

import com.evoting.evoting.model.Admin;
import com.evoting.evoting.model.Election;
import com.evoting.evoting.model.Candidate;
import com.evoting.evoting.service.AdminService;
import com.evoting.evoting.service.ElectionService;
import com.evoting.evoting.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {

    private final AdminService adminService;
    private final ElectionService electionService;
    private final CandidateService candidateService;

    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {
        return adminService.register(admin);
    }

    @PostMapping("/login")
    public Admin login(@RequestParam String username,
                       @RequestParam String password) {
        return adminService.login(username, password);
    }

    @PostMapping("/create-election")
    public Election createElection(@RequestBody Election election) {
        return electionService.createElection(election);
    }

    @PostMapping("/add-candidate")
    public Candidate addCandidate(@RequestBody Candidate candidate) {
        return candidateService.addCandidate(candidate);
    }

    @PutMapping("/update-status/{id}")
    public Election updateStatus(@PathVariable Long id,
                                 @RequestParam String status) {
        return electionService.updateStatus(id, status);
    }
}
