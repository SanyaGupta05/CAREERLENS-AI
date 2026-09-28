package AI.Career.Navigator.Controller;

import AI.Career.Navigator.Entity.ResumeAnalysis;
import AI.Career.Navigator.Entity.User;
import AI.Career.Navigator.Repository.UserRepository;
import AI.Career.Navigator.Service.ResumeAnalysisService;
import AI.Career.Navigator.Service.ResumeAnalyzerService;
import AI.Career.Navigator.dto.ResumeAnalysisRequest;
import AI.Career.Navigator.dto.ResumeResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ResumeController {

    private final ResumeAnalyzerService analyzerService;
    private final ResumeAnalysisService resumeAnalysisService;
    private final UserRepository userRepository;

    public ResumeController(
            ResumeAnalyzerService analyzerService,
            ResumeAnalysisService resumeAnalysisService,
            UserRepository userRepository) {

        this.analyzerService = analyzerService;
        this.resumeAnalysisService = resumeAnalysisService;
        this.userRepository = userRepository;
    }

    @PostMapping("/resume")
    public ResponseEntity<?> analyzeResume(
            @RequestBody ResumeAnalysisRequest request) {

        Optional<User> userOptional =
                userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body("User not found");
        }

        User user = userOptional.get();

        ResumeResponse response =
                analyzerService.analyzeResume(request.getResumeText());

        String skills = String.join(", ", response.getSkills());
        String skillGaps = String.join(", ", response.getSkillGaps());

        ResumeAnalysis savedAnalysis =
                resumeAnalysisService.saveAnalysis(
                        user,
                        response.getScore(),
                        skills,
                        skillGaps,
                        request.getRecommendedCareer()
                );

        return ResponseEntity.ok(response);
    }
@GetMapping("/resume/{email}")
public ResponseEntity<?> getResumeAnalysis(@PathVariable String email) {

    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isEmpty()) {
        return ResponseEntity
                .status(404)
                .body("User not found");
    }

    User user = userOptional.get();

    Optional<ResumeAnalysis> analysisOptional =
            resumeAnalysisService.getAnalysis(user);

    if (analysisOptional.isEmpty()) {
        return ResponseEntity
                .status(404)
                .body("No resume analysis found");
    }

    return ResponseEntity.ok(analysisOptional.get());
}
}