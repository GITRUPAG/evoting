package com.evoting.evoting.dto;

import lombok.Data;

@Data
public class CastVoteRequest {
    private Long voterId;
    private Long electionId;
    private Long candidateId;
    private String otp; // only required for verify-otp
}
