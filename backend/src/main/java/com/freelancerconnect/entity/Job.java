package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double budget;
    private String deadline;

    // The client who posted the job
    private Long clientId;
    private String clientName;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    private LocalDateTime createdAt = LocalDateTime.now();
}
