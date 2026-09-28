const careers = {

    "Data Analyst": [
        "Python",
        "Excel",
        "SQL",
        "Power BI",
        "Data Analysis",
        "Statistics"
    ],

    "Web Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "Git"
    ],

    "Machine Learning Engineer": [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "SQL",
        "Git"
    ],

    "Business Analyst": [
        "Excel",
        "Power BI",
        "SQL",
        "Data Analysis",
        "Statistics"
    ]

};


// ==========================================
// GET SAVED DATA FROM DATABASE
// ==========================================

let topcareer = null;
let resumescore = null;
let detectedSkills = [];

async function loadUserAnalysis() {

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser"));


    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }
    const welcomeUser =
    document.getElementById("welcomeUser");

if (welcomeUser) {
    welcomeUser.textContent =
        "Hello, " + loggedInUser.fullName;
}

    try {

        const response = await fetch(
            "http://localhost:8080/api/resume/" +
            encodeURIComponent(loggedInUser.email)
        );

        if (response.ok) {

            const analysis = await response.json();

            resumescore =
                analysis.resumeScore;

            detectedSkills =
                analysis.detectedSkills
                    ? analysis.detectedSkills
                        .split(",")
                        .map(skill => skill.trim())
                    : [];

            if (analysis.recommendedCareer) {

                topcareer = {
                    career: analysis.recommendedCareer,
                    match: calculateCareerMatch(
                        detectedSkills,
                        careers[analysis.recommendedCareer] || []
                    )
                };

            }

        } else {

            console.log("No saved resume analysis found.");

        }

        initializeDashboard();

    } catch (error) {

        console.error(
            "Error loading resume analysis:",
            error
        );

    }
}

// ==========================================
// GET HTML ELEMENTS
// ==========================================

const topCareerElement =
    document.getElementById("topcareer");

const resumeScoreElement =
    document.getElementById("resumescore");

const detectedSkillsElement =
    document.getElementById("detectedSkills");

const careerPathsElement =
    document.getElementById("careerpaths");

const skillGapElement =
    document.getElementById("skillgap");


// ==========================================
// NORMALIZE SKILLS
// ==========================================

function normalizeSkill(skill) {

    return skill
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[.-]/g, "");

}


// ==========================================
// CHECK SKILL
// ==========================================

function hasSkill(userSkills, requiredSkill) {

    const normalizedRequiredSkill =
        normalizeSkill(requiredSkill);

    return userSkills.some(function(skill) {

        return normalizeSkill(skill)
            === normalizedRequiredSkill;

    });

}


// ==========================================
// CALCULATE CAREER MATCH
// ==========================================

function calculateCareerMatch(
    userSkills,
    requiredSkills
) {

    let matchedSkills = 0;

    requiredSkills.forEach(function(skill) {

        if (hasSkill(userSkills, skill)) {

            matchedSkills++;

        }

    });


    if (requiredSkills.length === 0) {

        return 0;

    }


    return Math.round(
        (matchedSkills / requiredSkills.length) * 100
    );

}


// ==========================================
// DISPLAY TOP CAREER
// ==========================================

function displayTopCareer() {

    if (!topcareer) {

        topCareerElement.textContent =
            "No resume analyzed yet.";

        return;

    }


    if (
        topcareer.career &&
        topcareer.match !== undefined
    ) {

        topCareerElement.innerHTML =

            "<strong>" +
            topcareer.career +
            "</strong>" +

            "<span class='match-badge'>" +
            topcareer.match +
            "% Match" +
            "</span>";

    }

    else {

        topCareerElement.textContent =
            "No career recommendation available.";

    }

}


// ==========================================
// DISPLAY RESUME SCORE
// ==========================================

function displayResumeScore() {

    if (resumescore) {

        // Only display the number.
        // /100 is already present in dashboard.html.

        resumeScoreElement.textContent =
            resumescore;

    }

    else {

        resumeScoreElement.textContent =
            "--";

    }

}


// ==========================================
// DISPLAY DETECTED SKILLS
// ==========================================

function displayDetectedSkills() {

    if (
        !detectedSkills ||
        detectedSkills.length === 0
    ) {

        detectedSkillsElement.textContent =
            "No skills detected.";

        return;

    }


    detectedSkillsElement.textContent =
        detectedSkills.join(", ");

}


// ==========================================
// SHOW CAREER PATHS
// ==========================================

function showCareerPaths() {

    if (!careerPathsElement) {

        return;

    }


    if (detectedSkills.length === 0) {

        careerPathsElement.innerHTML =

            "<h3>Career Matches</h3>" +

            "<p>" +
            "Please analyze your resume first to see career matches." +
            "</p>";

        return;

    }


    let output =

        "<div class='results-header'>" +
        "<h3>Career Matches</h3>" +
        "<p>Career paths based on your detected skills.</p>" +
        "</div>";


    for (const career in careers) {

        const requiredSkills =
            careers[career];


        const matchPercentage =
            calculateCareerMatch(
                detectedSkills,
                requiredSkills
            );


        output +=

            "<div class='career-match'>" +

                "<div>" +

                    "<h4>" +
                    career +
                    "</h4>" +

                    "<p>" +
                    "Skill compatibility based on your resume." +
                    "</p>" +

                "</div>" +

                "<span class='match-badge'>" +
                matchPercentage +
                "% Match" +
                "</span>" +

            "</div>";

    }


    careerPathsElement.innerHTML =
        output;
}
function showSkillGaps() {
    if (!skillGapElement) {
        return;
    }
    if (detectedSkills.length === 0) {
        skillGapElement.innerHTML =
            "<h3>Skills You Can Improve</h3>" +
            "<p>" +
            "Please analyze your resume first." +
            "</p>";
        return;
    }
    let targetCareer = null;
    if (
        topcareer &&
        topcareer.career
    ) {
        targetCareer =
            topcareer.career;
    }
    if (
        !targetCareer ||
        !careers[targetCareer]
    ) {
        targetCareer =
            "Data Analyst";
    }
    const requiredSkills =
        careers[targetCareer];
    const missingSkills = [];
    requiredSkills.forEach(function(skill) {
        if (
            !hasSkill(
                detectedSkills,
                skill
            )
        ) {
            missingSkills.push(skill);
        }
    });
    if (missingSkills.length > 0) {
        let skillsHTML = "";
        missingSkills.forEach(function(skill) {
            skillsHTML +=
                "<span class='skill-tag'>" +
                skill +
                "</span>";
        });
        skillGapElement.innerHTML =
            "<div class='results-header'>" +
                "<h3>Skills You Can Improve</h3>" +
                "<p>" +
                "Based on your recommended career: " +
                "<strong>" +
                targetCareer +
                "</strong>" +
                "</p>" +
            "</div>" +
            "<div class='skill-tags'>" +
            skillsHTML +
            "</div>";
    }
    else {
        skillGapElement.innerHTML =
            "<div class='success-result'>" +
                "<h3>Great!</h3>" +
                "<p>" +
                "No major skill gaps detected for " +
                targetCareer +
                "." +
                "</p>" +
            "</div>";
    }
}
function initializeDashboard() {
    displayTopCareer();
    displayResumeScore();
    displayDetectedSkills();
}
loadUserAnalysis();