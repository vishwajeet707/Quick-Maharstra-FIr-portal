const API_URL = "http://localhost:3000/users";
const FIR_API_URL = "http://localhost:3000/firs";
let users = [];
let editIndex = null;

// Fetch users from mock API
function fetchUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            users = data;
            renderUsers(); // Render all users initially
        })
        .catch(error => console.error("Error fetching users:", error));
}

// Search Users
function searchUsers() {
    const query = document.getElementById("search").value.trim().toLowerCase();

    // Filter users based on the search query
    const filteredUsers = users.filter(user =>
        Object.values(user).some(value => 
            value.toString().toLowerCase().includes(query)
        )
    );

    renderUsers(filteredUsers);
}

// Add or Update User
function addOrUpdateUser() {
    const user = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        aadhar: document.getElementById("aadhar").value.trim(),
        pan: document.getElementById("pan").value.trim(),
        username: document.getElementById("username").value.trim()
    };

    let method = "POST";
    let url = API_URL;

    if (editIndex !== null) {
        method = "PUT";
        user.id = users[editIndex].id;
        url = `${API_URL}/${user.id}`;
    }

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(() => {
            editIndex = null;
            clearForm();
            fetchUsers();
        })
        .catch(error => console.error("Error saving user:", error));
}

// Edit User (Populates form fields)
function editUser(index) {
    editIndex = index;
    const user = users[index];

    document.getElementById("fullName").value = user.fullName;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("address").value = user.address;
    document.getElementById("aadhar").value = user.aadhar;
    document.getElementById("pan").value = user.pan;
    document.getElementById("username").value = user.username;

    document.getElementById("submitBtn").innerText = "Update User";
}

// Delete user along with FIRs
function deleteUser(index) {
    const userId = users[index].id;

    fetch(FIR_API_URL)
        .then(response => response.json())
        .then(firs => {
            const firsToDelete = firs.filter(fir => fir.userId === userId);
            firsToDelete.forEach(fir => {
                fetch(`${FIR_API_URL}/${fir.id}`, { method: "DELETE" });
            });

            return fetch(`${API_URL}/${userId}`, { method: "DELETE" });
        })
        .then(() => {
            fetchUsers();
        })
        .catch(error => console.error("Error deleting user:", error));
}

// Render users in the table
function renderUsers(filteredUsers = users) {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    filteredUsers.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
            <td>${user.aadhar}</td>
            <td>${user.pan}</td>
            <td>${user.username}</td>
            <td>
                <button onclick="editUser(${index})" class="btn btn-success">Edit</button>
                <button onclick="deleteUser(${index})" class="btn btn-danger">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });

    document.getElementById("submitBtn").innerText = "Add User";
}

// Clear form
function clearForm() {
    document.getElementById("userForm").reset();
    editIndex = null;
}

// Initial fetch
fetchUsers();


