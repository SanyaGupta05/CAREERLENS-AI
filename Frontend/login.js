document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://careerlens-ai-csrz.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const user = await response.json();

            localStorage.setItem("loggedInUser", JSON.stringify({
                id: user.id,
                fullName: user.fullName,
                email: user.email
            }));

            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            const error = await response.text();
            alert(error || "Invalid email or password.");
        }

    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
});