package com.evoting.evoting.dto;

import lombok.Data;

@Data
public class StatsDto {
    private long totalElections;
    private long activeElections;
    private long completedElections;

    private long totalVoters;
    private long votesCast;
    private double turnoutPercentage;
}
