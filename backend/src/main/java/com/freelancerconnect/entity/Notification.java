package com.freelancerconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Can be clientId or freelancerId
    private String message;
    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
