package com.freelancerconnect.controller;

import com.freelancerconnect.dto.ApplicationDTO;
import com.freelancerconnect.dto.ApplicationRequest;
import com.freelancerconnect.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<?> applyForJob(@RequestBody ApplicationRequest request) {
        try {
            applicationService.applyForJob(request);
            return ResponseEntity.ok("Application submitted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }
}
