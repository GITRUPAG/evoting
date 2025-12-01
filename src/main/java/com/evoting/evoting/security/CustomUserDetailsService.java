package com.evoting.evoting.security;

import com.evoting.evoting.model.Admin;
import com.evoting.evoting.model.Voter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import com.evoting.evoting.repository.AdminRepository;
import com.evoting.evoting.repository.VoterRepository;



import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final VoterRepository voterRepository;

    /**
     * We first try to load admin by username, if not found, treat the supplied username as voter email.
     */
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Try admin by username
        Admin admin = adminRepository.findByUsername(usernameOrEmail).orElse(null);
        if (admin != null) {
            return new User(admin.getUsername(), admin.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        // Try voter by email
        Voter voter = voterRepository.findByEmail(usernameOrEmail).orElse(null);
        if (voter != null) {
            return new User(voter.getEmail(), voter.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_VOTER")));
        }

        throw new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
    }
}
