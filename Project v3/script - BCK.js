
import {FBsignIn, FBsignUp, addToDB} from './FB.js';

//event listners 

document.addEventListener("DOMContentLoaded", function () { 
    // Load existing passwords from localStorage on page load
   loadPasswords();
});

document.getElementById("formSubmit").addEventListener("click", function () {
    validateEntry();
});

document.getElementById("signUpButton").addEventListener("click", function () {
    FBsignUp();
});

document.getElementById("loginButton").addEventListener("click", function () {
    FBsignIn();
});




function addPassword() {
    // Get form values
    var website = document.getElementById("website").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    addToDB("default", website, username, password, "www.google.com")

    // Create a password object
    var newPassword = {website: website,username: username, password: password};

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
        // temp variable pointing to row
        var row = tableBody.insertRow();
        // dispalys website
        var cellWebsite = row.insertCell(0);
        cellWebsite.textContent = password.website;
        // displays username
        var cellUsername = row.insertCell(1);
        cellUsername.textContent = password.username;
        // dispalys password
        var cellPassword = row.insertCell(2);
        cellPassword.textContent = password.password;
        // displays delete button
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
    // retrieve passwords from localStorage
    var passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    // remove the password at the given index
    passwords.splice(index, 1);
    // save the passwords back to localStorage
    localStorage.setItem("passwords", JSON.stringify(passwords));
    loadPasswords();
}

function validateEntry() {
    // get form and run check to see if all fields are filled
    var passForm = document.getElementById("passwordForm");
    var inputs = passForm.querySelectorAll("input[required]");
    console.log(currentUser);
    var noreq = false;
    //goes through all inputs to check if they're filled also being stripped of whitespace
    inputs.forEach(function(input) {
        if (!input.value.trim()) {
            noreq = true;
        }
    });
    if (noreq) {
        alert("All fields must be filled");
    }
    else {
        addPassword();
    }
    
}