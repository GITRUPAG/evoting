package com.evoting.evoting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoteHistoryResponse {
    private Long electionId;
    private String electionName;
    private String status;   // Always: "Voted"
}
