package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.repository.FreelancerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/freelancers")
@CrossOrigin(origins = "http://localhost:5173")
public class FreelancerController {

    @Autowired
    private FreelancerRepository freelancerRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFreelancer(@PathVariable Long id, @RequestBody Freelancer updatedFreelancer) {
        return freelancerRepository.findById(id).map(freelancer -> {
            if (updatedFreelancer.getSkills() != null) {
                freelancer.setSkills(updatedFreelancer.getSkills());
            }
            // Add other fields if needed
            freelancerRepository.save(freelancer);
            return ResponseEntity.ok(freelancer);
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Freelancer> getFreelancer(@PathVariable Long id) {
        return freelancerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
