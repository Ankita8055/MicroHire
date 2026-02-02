package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private Long freelancerId;
    
    // We store the calculated match percentage here for sorting
    private Double matchPercentage;

    private String status; // APPLIED, ACCEPTED, REJECTED

    private LocalDateTime appliedAt = LocalDateTime.now();
}
