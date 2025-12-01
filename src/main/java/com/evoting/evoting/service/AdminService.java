package com.evoting.evoting.service;

import com.evoting.evoting.model.Admin;
import com.evoting.evoting.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin register(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {  
            throw new RuntimeException("Username already exists!");
        }
        return adminRepository.save(admin);
    }

    public Admin login(String username, String password) {
        return adminRepository.findByUsername(username)
                .filter(a -> a.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials!"));
    }
}
