package com.evoting.evoting.dto;

import lombok.Data;

@Data
public class CandidateProfileDto {

    private Long id;
    private String name;
    private String party;
    private String position;
    private String bio;
    private String imageUrl;

    private Long electionId;
    private String electionTitle;
}
