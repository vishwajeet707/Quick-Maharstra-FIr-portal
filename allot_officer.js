document.addEventListener("DOMContentLoaded", () => {
    const firSelect = document.getElementById("firSelect");
    const officerSelect = document.getElementById("officerSelect");
    const allotOfficerForm = document.getElementById("allotOfficerForm");
    const allotmentTableBody = document.getElementById("allotmentTableBody");
    const logoutBtn = document.getElementById("logout");

    // ✅ Function to Fetch Pending FIRs
    async function fetchFIRs() {
        try {
            const response = await fetch("http://localhost:3000/firs");
            const data = await response.json();

            firSelect.innerHTML = '<option value="">Select FIR</option>';
            data.forEach(fir => {
                let option = document.createElement("option");
                option.value = fir.id;
                option.textContent = `FIR ${fir.id} - ${fir.title}`; // ✅ Fixed issue
                firSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching FIRs:", error);
        }
    }

    // ✅ Function to Fetch Available Officers
    async function fetchOfficers() {
        try {
            const response = await fetch("http://localhost:3000/officers");
            const data = await response.json();

            officerSelect.innerHTML = '<option value="">Select Officer</option>';
            data.forEach(officer => {
                let option = document.createElement("option");
                option.value = officer.id;
                option.textContent = `${officer.name} (Badge: ${officer.badgeNumber})`;
                officerSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching officers:", error);
        }
    }

    // ✅ Function to Fetch and Display Allotments
    async function fetchAllotments() {
        try {
            const response = await fetch("http://localhost:3000/allotments");
            const allotments = await response.json();

            // Fetch FIRs and Officers for mapping
            const firResponse = await fetch("http://localhost:3000/firs");
            const firs = await firResponse.json();

            const officerResponse = await fetch("http://localhost:3000/officers");
            const officers = await officerResponse.json();

            // Create Maps
            const firMap = {};
            firs.forEach(fir => (firMap[fir.id] = fir.title));

            const officerMap = {};
            officers.forEach(officer => (officerMap[officer.id] = { name: officer.name, badgeNumber: officer.badgeNumber }));

            // Inject Data into Table
            allotmentTableBody.innerHTML = ""; // Clear previous data
            allotments.forEach((allotment, index) => {
                let row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${allotment.firId}</td>
                    <td>${firMap[allotment.firId] || "Unknown"}</td>
                    <td>${officerMap[allotment.officerId]?.name || "Unknown"}</td>
                    <td>${officerMap[allotment.officerId]?.badgeNumber || "N/A"}</td>
                `;

                allotmentTableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Error fetching allotments:", error);
        }
    }

    // ✅ Function to Allot Officer to FIR
    allotOfficerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const firId = firSelect.value;
        const officerId = officerSelect.value;

        if (!firId || !officerId) {
            alert("Please select both an FIR and an Officer.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/allotments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firId, officerId }),
            });

            if (response.ok) {
                alert("Officer successfully allotted to FIR!");
                fetchFIRs(); // Refresh FIR list
                fetchOfficers(); // Refresh available officers
                fetchAllotments(); // Refresh Allotment Table
            } else {
                alert("Failed to allot officer. Please try again.");
            }
        } catch (error) {
            console.error("Error allotting officer:", error);
        }
    });

    // ✅ Logout Function
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("adminLoggedIn");
        window.location.href = "admin_login.html"; // Redirect to login page
    });

    // ✅ Initialize the page
    fetchFIRs();
    fetchOfficers();
    fetchAllotments();
});



