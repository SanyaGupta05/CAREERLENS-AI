package AI.Career.Navigator.Service;

import AI.Career.Navigator.dto.ResumeResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ResumeAnalyzerService {

    // =========================================================
    // MAIN ANALYSIS METHOD
    // =========================================================

    public ResumeResponse analyzeResume(String resumeText) {

        List<String> detectedSkills = detectSkills(resumeText);

        int score = calculateScore(resumeText, detectedSkills);

        List<String> skillGaps = findSkillGaps(detectedSkills);

        return new ResumeResponse(
                score,
                detectedSkills,
                skillGaps
        );
    }


    // =========================================================
    // SKILL DETECTION
    // =========================================================

    public List<String> detectSkills(String resumeText) {

        List<String> detectedSkills = new ArrayList<>();

        addSkillIfFound(
                resumeText,
                "C",
                "\\bC\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "C++",
                "C\\s*\\+\\s*\\+",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Java",
                "\\bJava\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Python",
                "\\bPython\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "HTML",
                "\\bHTML(?:5)?\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "CSS",
                "\\bCSS(?:3)?\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "JavaScript",
                "\\bJavaScript\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "React",
                "\\bReact(?:\\.js)?\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Node.js",
                "\\bNode(?:\\.js)?\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "SQL",
                "\\bSQL\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Git",
                "\\bGit\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "GitHub",
                "\\bGitHub\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "VS Code",
                "\\bVS\\s*Code\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Excel",
                "\\b(?:MS\\s*)?Excel\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Power BI",
                "\\bPower\\s*BI\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Tableau",
                "\\bTableau\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Data Analysis",
                "\\bData\\s+Analysis\\b",
                detectedSkills
        );

        addSkillIfFound(
                resumeText,
                "Machine Learning",
                "\\bMachine\\s+Learning\\b",
                detectedSkills
        );

        return detectedSkills;
    }


    // =========================================================
    // HELPER METHOD
    // =========================================================

    private void addSkillIfFound(
            String resumeText,
            String skillName,
            String regex,
            List<String> detectedSkills) {

        Pattern pattern = Pattern.compile(
                regex,
                Pattern.CASE_INSENSITIVE
        );

        if (pattern.matcher(resumeText).find()) {
            detectedSkills.add(skillName);
        }
    }


    // =========================================================
    // RESUME SCORE
    // =========================================================

    public int calculateScore(
            String resumeText,
            List<String> skills) {

        int score = 0;

        int skillCount = skills.size();


        // Skills - 30 points

        if (skillCount >= 8) {

            score += 30;

        } else if (skillCount >= 5) {

            score += 25;

        } else if (skillCount >= 3) {

            score += 20;

        } else if (skillCount >= 1) {

            score += 10;
        }


        String lowerText = resumeText.toLowerCase();


        // Education - 20 points

        if (lowerText.contains("bachelor")
                || lowerText.contains("b.tech")
                || lowerText.contains("bca")
                || lowerText.contains("master")
                || lowerText.contains("m.tech")
                || lowerText.contains("degree")
                || lowerText.contains("university")
                || lowerText.contains("college")) {

            score += 20;
        }


        // Experience - 20 points

        if (lowerText.contains("internship")
                || lowerText.contains("intern ")
                || lowerText.contains("software engineer")
                || lowerText.contains("developer")
                || lowerText.contains("worked at")
                || lowerText.contains("employment")) {

            score += 20;
        }


        // Projects - 15 points

        if (lowerText.contains("projects")
                || lowerText.contains("project:")
                || lowerText.contains("developed")
                || lowerText.contains("built")) {

            score += 15;
        }


        // Email - 10 points

        Pattern emailPattern = Pattern.compile(
                "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b"
        );

        if (emailPattern.matcher(resumeText).find()) {

            score += 10;
        }


        // Resume length - 5 points

        if (resumeText.length() >= 1000) {

            score += 5;
        }


        // Maximum score = 100

        if (score > 100) {

            score = 100;
        }


        return score;
    }


    // =========================================================
    // SKILL GAP ANALYSIS
    // =========================================================

    public List<String> findSkillGaps(
            List<String> detectedSkills) {

        List<String> requiredSkills = List.of(
                "Python",
                "SQL",
                "Excel",
                "Power BI",
                "Machine Learning",
                "Data Analysis",
                "Tableau",
                "Git",
                "JavaScript"
        );

        List<String> missingSkills = new ArrayList<>();

        for (String requiredSkill : requiredSkills) {

            boolean found = detectedSkills.stream()
                    .anyMatch(skill ->
                            skill.equalsIgnoreCase(requiredSkill)
                    );

            if (!found) {

                missingSkills.add(requiredSkill);
            }
        }

        return missingSkills;
    }
}