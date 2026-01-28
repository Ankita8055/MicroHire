package com.freelancerconnect.service;

import com.freelancerconnect.entity.Client;
import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.entity.OtpVerification;
import com.freelancerconnect.repository.ClientRepository;
import com.freelancerconnect.repository.FreelancerRepository;
import com.freelancerconnect.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void sendEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("FreelancerConnect Registration OTP");
        message.setText("Your OTP for registration is: " + otp + "\nThis OTP will expire in 5 minutes.");
        mailSender.send(message);
    }

    @Transactional
    public String initiateRegistration(String fullName, String email, String password, String mobileNo, String role) {
        // Check if user already exists
        if (clientRepository.findByEmail(email).isPresent() || freelancerRepository.findByEmail(email).isPresent()) {
            return "Email already registered!";
        }

        String otp = generateOtp();

        // Save temporary registration data
        otpRepository.deleteByEmail(email); // Clear any old OTPs for this email

        OtpVerification otpData = new OtpVerification();
        otpData.setEmail(email);
        otpData.setOtp(otp);
        otpData.setFullName(fullName);
        otpData.setPassword(password); // In a real app, encrypt this!
        otpData.setMobileNo(mobileNo);
        otpData.setRole(role);
        otpData.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpData);

        try {
            sendEmail(email, otp);
            return "OTP sent successfully to " + email;
        } catch (Exception e) {
            return "Failed to send email: " + e.getMessage();
        }
    }

    @Transactional
    public String verifyOtpAndRegister(String email, String otp) {
        OtpVerification otpData = otpRepository.findByEmailAndOtp(email, otp)
                .orElse(null);

        if (otpData == null || otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Invalid or expired OTP!";
        }

        if ("CLIENT".equalsIgnoreCase(otpData.getRole())) {
            Client client = new Client();
            client.setFullName(otpData.getFullName());
            client.setEmail(otpData.getEmail());
            client.setPassword(otpData.getPassword());
            client.setMobileNo(otpData.getMobileNo());
            client.setVerified(true);
            clientRepository.save(client);
        } else if ("FREELANCER".equalsIgnoreCase(otpData.getRole())) {
            Freelancer freelancer = new Freelancer();
            freelancer.setFullName(otpData.getFullName());
            freelancer.setEmail(otpData.getEmail());
            freelancer.setPassword(otpData.getPassword());
            freelancer.setMobileNo(otpData.getMobileNo());
            freelancer.setVerified(true);
            freelancerRepository.save(freelancer);
        }

        otpRepository.delete(otpData);
        return "Registration successful!";
    }

    public com.freelancerconnect.dto.LoginResponse login(String email, String password) {
        var client = clientRepository.findByEmail(email);
        if (client.isPresent() && client.get().getPassword().equals(password)) {
            return new com.freelancerconnect.dto.LoginResponse(
                    "Login successful as Client!",
                    client.get().getId(),
                    "CLIENT",
                    client.get().getFullName());
        }

        var freelancer = freelancerRepository.findByEmail(email);
        if (freelancer.isPresent() && freelancer.get().getPassword().equals(password)) {
            return new com.freelancerconnect.dto.LoginResponse(
                    "Login successful as Freelancer!",
                    freelancer.get().getId(),
                    "FREELANCER",
                    freelancer.get().getFullName());
        }

        return new com.freelancerconnect.dto.LoginResponse("Invalid email or password!", null, null, null);
    }
}
