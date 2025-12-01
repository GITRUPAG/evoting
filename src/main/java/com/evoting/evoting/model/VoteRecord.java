package com.evoting.evoting.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vote_records")
public class VoteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "voter_id")
    private Voter voter;

    private LocalDateTime voteTime;

    private String blockchainTxHash;

    @ManyToOne
    @JoinColumn(name = "election_id")
    private Election election;
}
