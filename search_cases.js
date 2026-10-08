const API_URL = "http://localhost:3000"; // Base URL of your JSON server

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const phone = document.getElementById("phone").value.trim();

    // Validate that the phone number is provided
    if (!phone) {
      alert("Please enter a mobile number.");
      return;
    }

    try {
      await searchByPhone(phone); // Search FIRs by mobile number
    } catch (error) {
      console.error(error);
      alert("An error occurred while searching. Please try again.");
    }
  });
});

// Function to search by mobile number
async function searchByPhone(phone) {
  try {
    // Search user by phone number
    const userResponse = await fetch(`${API_URL}/users?phone=${phone}`); // Corrected the endpoint
    if (userResponse.ok) {
      const users = await userResponse.json();
      if (users.length > 0) {
        const userId = users[0].id;

        // Fetch FIRs associated with the user ID
        const firResponse = await fetch(`${API_URL}/firs?userId=${userId}`);
        if (firResponse.ok) {
          const firs = await firResponse.json();
          displayCaseResults(firs);
        } else {
          alert("Failed to fetch FIRs for the user.");
        }
      } else {
        alert(`No user found with the mobile number: ${phone}`);
      }
    } else {
      alert("Failed to search users by mobile number.");
    }
  } catch (error) {
    console.error(error);
    alert("Error fetching cases by mobile number.");
  }
}

// Function to display case results
function displayCaseResults(firs) {
  const resultsDiv = document.getElementById("results");

  if (!firs || firs.length === 0) {
    resultsDiv.innerHTML = "<p>No cases found.</p>";
    return;
  }

  // Clear previous results
  resultsDiv.innerHTML = "";

  firs.forEach(fir => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    resultItem.innerHTML = `
      <h4>Title: ${fir.title}</h4>
      <p><strong>Location:</strong> ${fir.location}</p>
      <p><strong>Status:</strong> ${fir.status}</p>
      <p><strong>Date:</strong> ${fir.date}</p>
      <p><strong>Details:</strong> ${fir.details}</p>
    `;

    resultsDiv.appendChild(resultItem);
  });
}
