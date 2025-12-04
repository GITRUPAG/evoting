package com.evoting.evoting.dto;

import lombok.Data;

@Data
public class CandidateVoteStatsDto {
    private String candidateName;
    private long votes;
}
