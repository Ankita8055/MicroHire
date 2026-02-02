package com.freelancerconnect.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDTO {
    private Long id;
    private Long jobId;
    private Long freelancerId;
    private String freelancerName;
    private String freelancerSkills;
    private String freelancerEmail;
    private Double matchPercentage;
    private String status;
    private LocalDateTime appliedAt;
}
