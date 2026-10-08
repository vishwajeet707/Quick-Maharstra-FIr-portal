const API_URL = "http://localhost:3000"; // Replace with your backend's URL

// Ensure userId is available and redirect if not found
document.addEventListener("DOMContentLoaded", async () => {
  let userId = new URLSearchParams(window.location.search).get("userId");

  // Fallback to localStorage if userId is not in the query params
  if (!userId) {
    userId = localStorage.getItem("userId");
  }

  // Redirect if no userId is found
  if (!userId) {
    alert("No user ID found. Redirecting to Sign-In page...");
    window.location.href = "./index.html";
    return;
  }

  localStorage.setItem("userId", userId); // Save to localStorage for future use

  try {
    // Fetch and display user details
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (response.ok) {
      const user = await response.json();
      document.getElementById("greetusername").textContent = `${user.fullName}`;
      loadUserFIRs(userId); // Load user FIRs
    } else {
      throw new Error("Failed to fetch user details.");
    }
  } catch (error) {
    console.error(error);
    alert("Unable to load user data. Redirecting to Sign-In page...");
    window.location.href = "login.html";
  }
});

// Load FIRs for the logged-in user
async function loadUserFIRs(userId) {
  try {
    const response = await fetch(`${API_URL}/firs?userId=${userId}`);
    if (response.ok) {
      const userFIRs = await response.json();
      renderFIRs(userFIRs);
    } else {
      throw new Error("Failed to fetch FIRs.");
    }
  } catch (error) {
    console.error(error);
    alert("Error loading FIR history.");
  }
}

// Populate FIR list
function renderFIRs(data) {
  const firList = document.getElementById("firList");
  firList.innerHTML = "";

  if (data.length === 0) {
    firList.innerHTML = "<li class='list-group-item'>No FIRs found.</li>";
    return;
  }

  data.forEach((fir) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <div>
        <strong>${fir.title}</strong> - ${fir.location} (${fir.date})
        <p>${fir.details}</p>
        <span class="badge bg-${fir.status === "Pending" ? "warning" : "success"}">${fir.status}</span>
      </div>
    `;
    firList.appendChild(li);
  });
}

// Search FIRs
document.getElementById("search").addEventListener("input", async function () {
  const query = this.value.toLowerCase();
  const userId = localStorage.getItem("userId");

  try {
    const response = await fetch(`${API_URL}/firs?userId=${userId}`);
    if (response.ok) {
      const userFIRs = await response.json();
      const filtered = userFIRs.filter(
        (fir) =>
          fir.title.toLowerCase().includes(query) ||
          fir.location.toLowerCase().includes(query) ||
          fir.date.includes(query)
      );
      renderFIRs(filtered);
    } else {
      throw new Error("Failed to search FIRs.");
    }
  } catch (error) {
    console.error(error);
    alert("Error searching FIRs.");
  }
});

// Handle FIR submission
document.getElementById("fileFirForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  if (!userId) {
    alert("No user ID found. Redirecting to Sign-In page...");
    window.location.href = "login.html";
    return;
  }

  const newFIR = {
    userId: userId, // Associate FIR with the logged-in user
    title: document.getElementById("firTitle").value,
    location: document.getElementById("firLocation").value,
    details: document.getElementById("firDetails").value,
    status: "Pending", // Default status
    date: new Date().toISOString().split("T")[0],
  };

  try {
    const response = await fetch(`${API_URL}/firs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFIR),
    });

    if (response.ok) {
      alert("FIR submitted successfully!");
      loadUserFIRs(userId); // Reload FIR list
    } else {
      throw new Error("Failed to submit FIR.");
    }
  } catch (error) {
    console.error(error);
    alert("Error submitting FIR. Please try again.");
  }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("userId");
  alert("Logged out successfully!");
  window.location.href = "./index.html";
});
