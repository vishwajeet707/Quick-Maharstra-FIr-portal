const API_URL = "http://localhost:3000/users"; // Update the API URL if necessary

// Generic function to show alert messages
function showAlert(message, type = "info") {
  alert(`${type.toUpperCase()}: ${message}`);
}

// Sign-Up form submission handler
if (window.location.pathname.includes("register.html")) {
  document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const userData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      aadhar: formData.get("aadhar"),
      pan: formData.get("pan"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    if (formData.get("password") !== formData.get("confirmPassword")) {
      showAlert("Passwords do not match. Please try again.", "error");
      return;
    }

    try {
      // Send user data to the JSON server
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        showAlert("Registration successful! Redirecting to the login page...");
        window.location.href = "./login.html";
      } else {
        showAlert("Registration failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showAlert("An unexpected error occurred. Please try again.", "error");
    }
  });
}

// Sign-In form submission handler
if (window.location.pathname.includes("login.html")) {
  document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect login data
    const usernameOrEmail = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // Fetch user data from JSON server
      const response = await fetch(API_URL);
      const users = await response.json();

      // Find matching user
      const user = users.find(
        (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
      );

      if (user) {
        showAlert("Login successful! Redirecting to your account...");
        window.location.href = `userloginpage.html?userId=${user.id}`;
      } else {
        showAlert("Invalid credentials. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showAlert("An unexpected error occurred. Please try again.", "error");
    }
  });
}
