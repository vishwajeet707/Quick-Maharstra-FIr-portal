// document.getElementById("adminRegisterForm").addEventListener("submit", async function(event) {
//     event.preventDefault();

//     const username = document.getElementById("regUsername").value;
//     const password = document.getElementById("regPassword").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     // Check if the password and confirm password match
//     if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//     }

//     // Check if username already exists by calling the mock API
//     const usernameExists = await checkUsernameExistence(username);

//     if (usernameExists) {
//         alert("This username already exists. Please choose a different one.");
//         return;
//     }

//     // Generate a 6-digit security key
//     const securityKey = Math.floor(100000 + Math.random() * 900000);

//     // Make the POST request to register the admin
//     const response = await fetch("http://localhost:3000/admins", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password, securityKey })
//     });

//     if (response.ok) {
//         document.getElementById("successMsg").innerText = "Registered successfully!";
//         // Show the OTP message in a prompt immediately after registration
//         const data = await response.json();
//         showOtpPrompt(data.securityKey);
//     } else {
//         alert("Registration failed!");
//     }
// });

// async function checkUsernameExistence(username) {
//     try {
//         // Fetch all admins and check if the username exists
//         const response = await fetch(`http://localhost:3000/admins?username=${username}`);
//         const admins = await response.json();

//         // If the length of admins is greater than 0, the username exists
//         return admins.length > 0;
//     } catch (error) {
//         console.error('Error checking username existence:', error);
//         alert('There was an error checking the username. Please try again later.');
//         return false;
//     }
// }

// function showOtpPrompt(securityKey) {
//     // Display the OTP in a prompt and show the OTP message
//     const otpMessage = `Your OTP for login is: ${securityKey}`;
    
//     // Show the prompt with the OTP message
//     window.prompt("OTP for Login", otpMessage);
// }



document.getElementById("adminRegisterForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const securityKey = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit security key

    const response = await fetch("http://localhost:3000/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, securityKey })
    });

    if (response.ok) {
        document.getElementById("successMsg").innerText = "Registered successfully!";

        // Show the OTP message in a prompt immediately after registration
        showOtpPrompt(securityKey);
    } else {
        alert("Registration failed!");
    }
});

function showOtpPrompt(securityKey) {
    // Display the OTP in a prompt and show the OTP message
    const otpMessage = `Your passkey for login is: ${securityKey}`;
    
    // Show the prompt with the OTP message
    window.prompt("OTP for Login", otpMessage);
}
