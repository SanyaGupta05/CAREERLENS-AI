document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password
            })
        });

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "login.html";
        } else {
    const errorText = await response.text();
    alert(errorText || "Registration failed.");
}

    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
});