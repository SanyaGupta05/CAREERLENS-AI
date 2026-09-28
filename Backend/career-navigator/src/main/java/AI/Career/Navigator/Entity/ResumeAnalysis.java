package AI.Career.Navigator.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_analysis")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private int resumeScore;

    @Column(columnDefinition = "TEXT")
    private String detectedSkills;

    @Column(columnDefinition = "TEXT")
    private String skillGaps;

    private String recommendedCareer;

    public ResumeAnalysis() {
    }

    public ResumeAnalysis(User user, int resumeScore, String detectedSkills,
                          String skillGaps, String recommendedCareer) {
        this.user = user;
        this.resumeScore = resumeScore;
        this.detectedSkills = detectedSkills;
        this.skillGaps = skillGaps;
        this.recommendedCareer = recommendedCareer;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getResumeScore() {
        return resumeScore;
    }

    public void setResumeScore(int resumeScore) {
        this.resumeScore = resumeScore;
    }

    public String getDetectedSkills() {
        return detectedSkills;
    }

    public void setDetectedSkills(String detectedSkills) {
        this.detectedSkills = detectedSkills;
    }

    public String getSkillGaps() {
        return skillGaps;
    }

    public void setSkillGaps(String skillGaps) {
        this.skillGaps = skillGaps;
    }

    public String getRecommendedCareer() {
        return recommendedCareer;
    }

    public void setRecommendedCareer(String recommendedCareer) {
        this.recommendedCareer = recommendedCareer;
    }
}