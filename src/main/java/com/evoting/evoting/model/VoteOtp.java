package com.evoting.evoting.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vote_otps")
public class VoteOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String otp;

    @OneToOne
    @JoinColumn(name = "voter_id")
    private Voter voter;

    private LocalDateTime expiryTime;
}
