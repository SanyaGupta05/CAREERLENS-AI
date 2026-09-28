package AI.Career.Navigator.Service;

import AI.Career.Navigator.Entity.ResumeAnalysis;
import AI.Career.Navigator.Entity.User;
import AI.Career.Navigator.Repository.ResumeAnalysisRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;

    public ResumeAnalysisService(ResumeAnalysisRepository resumeAnalysisRepository) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
    }

    public ResumeAnalysis saveAnalysis(
            User user,
            int resumeScore,
            String detectedSkills,
            String skillGaps,
            String recommendedCareer) {

        Optional<ResumeAnalysis> existingAnalysis =
                resumeAnalysisRepository.findByUser(user);

        ResumeAnalysis analysis;

        if (existingAnalysis.isPresent()) {
            analysis = existingAnalysis.get();

            analysis.setResumeScore(resumeScore);
            analysis.setDetectedSkills(detectedSkills);
            analysis.setSkillGaps(skillGaps);
            analysis.setRecommendedCareer(recommendedCareer);

        } else {
            analysis = new ResumeAnalysis(
                    user,
                    resumeScore,
                    detectedSkills,
                    skillGaps,
                    recommendedCareer
            );
        }

        return resumeAnalysisRepository.save(analysis);
    }

    public Optional<ResumeAnalysis> getAnalysis(User user) {
        return resumeAnalysisRepository.findByUser(user);
    }
}