console.log("AI Resume Analyzer script loaded.");

const resumeForm = document.getElementById("resumeform");
const resumeFileInput = document.getElementById("resumefile");

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


resumeForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const resumeFile = resumeFileInput.files[0];

    if (!resumeFile) {
        alert("Please select a resume.");
        return;
    }

    if (resumeFile.type !== "application/pdf") {
        alert("Please upload a PDF resume.");
        return;
    }

    try {

        // -----------------------------------------
        // 1. Extract text from PDF
        // -----------------------------------------

        const arrayBuffer = await resumeFile.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;

        let resumeText = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

            const page = await pdf.getPage(pageNumber);

            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map(item => item.str)
                .join(" ");

            resumeText += pageText + "\n";
        }

        console.log("Extracted resume text:");
        console.log(resumeText);

        document.getElementById("resumetext").textContent = resumeText;


        // -----------------------------------------
        // 2. Send resume text to Spring Boot
        // -----------------------------------------

        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
}

const response = await fetch(
    "http://localhost:8080/api/resume",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            resumeText: resumeText,
            email: loggedInUser.email,
            recommendedCareer: ""
        })
    }
);


        if (!response.ok) {

            throw new Error(
                "Backend returned status: " + response.status
            );

        }


        // -----------------------------------------
        // 3. Read backend JSON response
        // -----------------------------------------

        const backendResponse = await response.json();

        console.log("Backend response:");
        console.log(backendResponse);


        // -----------------------------------------
        // 4. Get data from backend
        // -----------------------------------------

        const score = backendResponse.score;

        const detectedSkills = backendResponse.skills || [];

        const skillGaps = backendResponse.skillGaps || [];


        // -----------------------------------------
        // 5. Display detected skills
        // -----------------------------------------

        const skillsElement =
            document.getElementById("skills");

        if (detectedSkills.length > 0) {

            skillsElement.textContent =
                detectedSkills.join(", ");

        } else {

            skillsElement.textContent =
                "No common skills detected.";

        }


        // -----------------------------------------
        // 6. Display skill gaps
        // -----------------------------------------

        const skillGapElement =
            document.getElementById("skillgap");

        if (skillGaps.length > 0) {

            skillGapElement.innerHTML =
                "<h3>Skills you can improve</h3>" +
                "<p>" +
                skillGaps.join(", ") +
                "</p>";

        } else {

            skillGapElement.innerHTML =
                "<h3>Great!</h3>" +
                "<p>No major skill gaps detected.</p>";

        }


        // -----------------------------------------
        // 7. Display resume score
        // -----------------------------------------

        document.getElementById("score").textContent =
            score + " / 100";


        // -----------------------------------------
        // 8. Save data for dashboard
        // -----------------------------------------

        localStorage.setItem(
            "detectedSkills",
            JSON.stringify(detectedSkills)
        );

        localStorage.setItem(
            "resumescore",
            score
        );


        // -----------------------------------------
        // 9. Career paths
        // -----------------------------------------

        const careers = {

            "Data Analyst": [
                "Python",
                "Excel",
                "Power BI",
                "SQL",
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
                "SQL",
                "Power BI",
                "Data Analysis",
                "Statistics"
            ]

        };


        // -----------------------------------------
        // 10. Calculate career matches
        // -----------------------------------------

        const careerResults = [];

        for (const career in careers) {

            const requiredSkills = careers[career];

            let matchedSkills = 0;


            requiredSkills.forEach(function (skill) {

                const found =
                    detectedSkills.some(function (detectedSkill) {

                        return detectedSkill.toLowerCase() ===
                            skill.toLowerCase();

                    });


                if (found) {
                    matchedSkills++;
                }

            });


            const matchPercentage = Math.round(
                (matchedSkills / requiredSkills.length) * 100
            );


            careerResults.push({

                career: career,

                match: matchPercentage

            });

        }


        // -----------------------------------------
        // 11. Sort careers
        // -----------------------------------------

        careerResults.sort(function (a, b) {

            return b.match - a.match;

        });


        // -----------------------------------------
        // 12. Display career results
        // -----------------------------------------

        let careerText = "";

        careerResults.forEach(function (result) {

            careerText +=
                "<p>" +
                "<strong>" +
                result.career +
                "</strong>" +
                " - " +
                result.match +
                "% Match" +
                "</p>";

        });


        document.getElementById("careers").innerHTML =
            careerText;


        // -----------------------------------------
        // 13. Save top career
        // -----------------------------------------

        const topCareer = careerResults[0];

localStorage.setItem(
    "topcareer",
    JSON.stringify(topCareer)
);

// Save the recommended career to the database
if (loggedInUser) {
    await fetch("http://localhost:8080/api/resume", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            resumeText: resumeText,
            email: loggedInUser.email,
            recommendedCareer: topCareer.career
        })
    });
}


        // -----------------------------------------
        // 14. Generate career roadmap
        // -----------------------------------------

        const careerSkills =
            careers[topCareer.career];

        const roadmapSkills = [];


        careerSkills.forEach(function (skill) {

            const found =
                detectedSkills.some(function (detectedSkill) {

                    return detectedSkill.toLowerCase() ===
                        skill.toLowerCase();

                });


            if (!found) {

                roadmapSkills.push(skill);

            }

        });


        let roadmapText = "";


        roadmapText +=
            "<p>" +
            "<strong>Your Recommended Career:</strong> " +
            topCareer.career +
            "</p>";


        if (roadmapSkills.length > 0) {

            roadmapText +=
                "<p><strong>Skills to learn:</strong></p>";


            roadmapSkills.forEach(function (skill, index) {

                roadmapText +=
                    "<p>" +
                    (index + 1) +
                    ". " +
                    skill +
                    "</p>";

            });

        } else {

            roadmapText +=
                "<p>" +
                "You already have the main skills " +
                "required for this career!" +
                "</p>";

        }


        document.getElementById("roadmap").innerHTML =
            roadmapText;


        // -----------------------------------------
        // 15. Success message
        // -----------------------------------------

        const messageElement =
            document.getElementById("message");

        if (messageElement) {

            messageElement.textContent =
                "Resume analysis completed successfully!";

            messageElement.style.color =
                "#16a34a";

        }


        console.log("Resume analysis completed.");

    }


    catch (error) {

        console.error(
            "Resume processing error:",
            error
        );


        const messageElement =
            document.getElementById("message");

        if (messageElement) {

            messageElement.textContent =
                "Something went wrong while analyzing the resume.";

            messageElement.style.color =
                "#dc2626";

        }

    }

});