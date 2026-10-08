document.getElementById("adminLoginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const securityKey = document.getElementById("loginSecurityKey").value;

    const response = await fetch("http://localhost:3000/admins");
    const admins = await response.json();

    const admin = admins.find(admin => admin.username === username && admin.password === password && admin.securityKey == securityKey);

    if (admin) {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin_dashboard.html"; // Redirect to dashboard
    } else {
        alert("Invalid credentials or security key!");
        window.location.href = "index.html"; // Redirect to index page
    }
});
