package com.freelancerconnect.repository;

import com.freelancerconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    // Find all jobs posted by a specific client
    List<Job> findByClientId(Long clientId);
}
