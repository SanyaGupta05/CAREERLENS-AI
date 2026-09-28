package AI.Career.Navigator.dto;

public class ResumeAnalysisRequest {

    private String resumeText;
    private String email;
    private String recommendedCareer;

    public ResumeAnalysisRequest() {
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRecommendedCareer() {
        return recommendedCareer;
    }

    public void setRecommendedCareer(String recommendedCareer) {
        this.recommendedCareer = recommendedCareer;
    }
}