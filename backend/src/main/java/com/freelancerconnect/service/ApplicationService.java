package com.freelancerconnect.service;

import com.freelancerconnect.dto.ApplicationDTO;
import com.freelancerconnect.dto.ApplicationRequest;
import com.freelancerconnect.entity.Application;
import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.entity.Job;
import com.freelancerconnect.repository.ApplicationRepository;
import com.freelancerconnect.repository.FreelancerRepository;
import com.freelancerconnect.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private NotificationService notificationService;

    public void applyForJob(ApplicationRequest request) {
        if (applicationRepository.existsByJobIdAndFreelancerId(request.getJobId(), request.getFreelancerId())) {
            throw new RuntimeException("You have already applied for this job.");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Freelancer freelancer = freelancerRepository.findById(request.getFreelancerId())
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        double matchPercentage = calculateMatchPercentage(freelancer.getSkills(), job.getRequiredSkills());

        Application application = new Application();
        application.setJobId(request.getJobId());
        application.setFreelancerId(request.getFreelancerId());
        application.setMatchPercentage(matchPercentage);
        application.setStatus("APPLIED");

        applicationRepository.save(application);

        // Notify Client
        String message = "Freelancer " + freelancer.getFullName() + " applied for your job: " + job.getTitle();
        notificationService.createNotification(job.getClientId(), message);
    }

    public List<ApplicationDTO> getApplicationsForJob(Long jobId) {
        List<Application> applications = applicationRepository.findByJobIdOrderByMatchPercentageDesc(jobId);

        return applications.stream().map(app -> {
            Freelancer freelancer = freelancerRepository.findById(app.getFreelancerId()).orElse(null);
            ApplicationDTO dto = new ApplicationDTO();
            dto.setId(app.getId());
            dto.setJobId(app.getJobId());
            dto.setFreelancerId(app.getFreelancerId());
            dto.setMatchPercentage(app.getMatchPercentage());
            dto.setStatus(app.getStatus());
            dto.setAppliedAt(app.getAppliedAt());

            if (freelancer != null) {
                dto.setFreelancerName(freelancer.getFullName());
                dto.setFreelancerSkills(freelancer.getSkills());
                dto.setFreelancerEmail(freelancer.getEmail());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    private Double calculateMatchPercentage(String freelancerSkills, String jobSkills) {
        if (jobSkills == null || jobSkills.trim().isEmpty()) return 0.0;
        if (freelancerSkills == null || freelancerSkills.trim().isEmpty()) return 0.0;

        // Clean and normalize (split by comma, semicolon, pipe, or newline)
        String[] jobSkillArray = jobSkills.split("[,;|\\n]+");
        String[] freelancerSkillArray = freelancerSkills.split("[,;|\\n]+");

        int matchCount = 0;
        int totalJobSkills = 0;

        for (String jSkill : jobSkillArray) {
            String trimmedJSkill = jSkill.trim().toLowerCase();
            if (trimmedJSkill.isEmpty()) continue;
            totalJobSkills++;
            
            boolean matched = false;
            for (String fSkill : freelancerSkillArray) {
                if (fSkill.trim().toLowerCase().equals(trimmedJSkill)) {
                    matched = true;
                    break; 
                }
            }
            if (matched) matchCount++;
        }

        if (totalJobSkills == 0) return 0.0;

        double percentage = ((double) matchCount / totalJobSkills) * 100;
        
        // Log for debugging
        System.out.println("Matching Job Skills: " + java.util.Arrays.toString(jobSkillArray) 
                + " with Freelancer Skills: " + java.util.Arrays.toString(freelancerSkillArray) 
                + " -> " + percentage + "%");

        return Math.round(percentage * 100.0) / 100.0; // Round to 2 decimals
    }
}
