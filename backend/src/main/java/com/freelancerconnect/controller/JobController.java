package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Job;
import com.freelancerconnect.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // Post a new job
    @PostMapping("/post")
    public Job postJob(@RequestBody Job job) {
        // Simple code: just save and return
        return jobRepository.save(job);
    }

    // Get all jobs for a specific client
    @GetMapping("/client/{clientId}")
    public List<Job> getClientJobs(@PathVariable Long clientId) {
        return jobRepository.findByClientId(clientId);
    }

    // Get all jobs (for freelancers to see)
    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
}
