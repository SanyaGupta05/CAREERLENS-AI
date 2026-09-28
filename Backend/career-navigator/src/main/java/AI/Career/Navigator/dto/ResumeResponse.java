package AI.Career.Navigator.dto;

import java.util.List;

public class ResumeResponse {

    private int score;

    private List<String> skills;

    private List<String> skillGaps;

    public ResumeResponse(
            int score,
            List<String> skills,
            List<String> skillGaps) {

        this.score = score;
        this.skills = skills;
        this.skillGaps = skillGaps;
    }

    public int getScore() {
        return score;
    }

    public List<String> getSkills() {
        return skills;
    }

    public List<String> getSkillGaps() {
        return skillGaps;
    }
}