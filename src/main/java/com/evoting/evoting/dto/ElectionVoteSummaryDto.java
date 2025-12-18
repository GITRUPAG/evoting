package com.evoting.evoting.dto;

import lombok.Data;

@Data
public class ElectionVoteSummaryDto {
    private Long electionId;
    private String electionTitle;
    private long totalVotes;
}
