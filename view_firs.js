const API_URL = "http://localhost:3000";

// Display all FIRs
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(`${API_URL}/firs`);
    if (response.ok) {
      const allFIRs = await response.json();
      renderFIRs(allFIRs);
    } else {
      throw new Error("Failed to fetch FIRs.");
    }
  } catch (error) {
    console.error(error);
    alert("Error loading FIR data.");
  }
});

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
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${fir.title}</strong> - ${fir.location} (${fir.date})
        <p>${fir.details}</p>
        <span class="badge bg-${fir.status === "Pending" ? "warning" : "success"}">${fir.status}</span>
      </div>
      <div>
        <button class="btn btn-primary btn-sm" onclick="changeStatus('${fir.id}', '${fir.status}')">Change Status</button>
      </div>
    `;
    firList.appendChild(li);
  });
}


// Change FIR status
async function changeStatus(firId, currentStatus) {
  const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";

  try {
    const response = await fetch(`${API_URL}/firs/${firId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      alert(`FIR status updated to ${newStatus}.`);
      updateStatusInUserDashboard(firId, newStatus); // Update status in the user's dashboard
      location.reload(); // Reload to reflect changes in admin dashboard
    } else {
      throw new Error("Failed to update FIR status.");
    }
  } catch (error) {
    console.error(error);
    alert("Error updating FIR status.");
  }
}

// Update status in User Dashboard
async function updateStatusInUserDashboard(firId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/firs/${firId}`);
    const fir = await response.json();

    // Assuming user has a dashboard where FIRs are listed
    const userId = fir.userId; // The user associated with the FIR
    const userResponse = await fetch(`${API_URL}/users/${userId}`);
    const user = await userResponse.json();

    // Update the status in user's FIRs list (this will be a separate operation)
    const userFIRResponse = await fetch(`${API_URL}/firs?userId=${userId}`);
    const userFIRs = await userFIRResponse.json();

    userFIRs.forEach(fir => {
      if (fir.id === firId) {
        fir.status = newStatus;
        // Update FIR status in user's dashboard
        fetch(`${API_URL}/firs/${fir.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    });
  } catch (error) {
    console.error(error);
    alert("Error updating FIR status in the user's dashboard.");
  }
}

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("adminId");
  alert("Logged out successfully!");
  window.location.href = "./login.html";
});

