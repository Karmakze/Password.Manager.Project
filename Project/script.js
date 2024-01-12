document.addEventListener("DOMContentLoaded", function () {
    // Load existing passwords from localStorage on page load
    loadPasswords();
});

function addPassword() {
    // Get form values
    var website = document.getElementById("website").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Create a password object
    var newPassword = {
        website: website,
        username: username,
        password: password,
    };

    // Get existing passwords from localStorage
    var passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    // Add the new password to the array
    passwords.push(newPassword);

    // Save the updated passwords to localStorage
    localStorage.setItem("passwords", JSON.stringify(passwords));

    // Clear the form
    document.getElementById("passwordForm").reset();

    // Reload the table with updated passwords
    loadPasswords();
}

function loadPasswords() {
    var passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    var tableBody = document.querySelector("#passwordTable tbody");
    tableBody.innerHTML = "";

    // Populate the table with passwords
    passwords.forEach(function (password, index) {
        var row = tableBody.insertRow();

        var cellWebsite = row.insertCell(0);
        cellWebsite.textContent = password.website;

        var cellUsername = row.insertCell(1);
        cellUsername.textContent = password.username;

        var cellPassword = row.insertCell(2);
        cellPassword.textContent = password.password;

        var cellAction = row.insertCell(3);
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deletePassword(index);
        };
        cellAction.appendChild(deleteButton);
    });
}

function deletePassword(index) {
    var passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    passwords.splice(index, 1);
    localStorage.setItem("passwords", JSON.stringify(passwords));
    loadPasswords();
}