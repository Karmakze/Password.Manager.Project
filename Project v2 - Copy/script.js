// Firebase implementation 
import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
//TODO setup database
const firebaseConfig = {
  apiKey: "AIzaSyCzvJrhnnPtUBNBHwpAdtb7BRsdcwzLx0c",
  authDomain: "passwordmanager-8ea4d.firebaseapp.com",
  //databaseURL: "",
  projectId: "passwordmanager-8ea4d",
  storageBucket: "passwordmanager-8ea4d.appspot.com",
  messagingSenderId: "1050356190318",
  appId: "1:1050356190318:web:1a062440c93da4b0aeea7f",
  measurementId: "G-TSZFDKTFYG"

};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = firebase.auth 


function FBsignIn() {
    var email = document.getElementById("usernameInp").value;
    var password = document.getElementById("passwordInp").value;
    auth.signInWithEmailAndPassword(email, password).then(userCredential => {
        console.log('User Signed in!');
    });
}

function FBsignUp() {
    var email = document.getElementById("usernameInp").value;
    var password = document.getElementById("passwordInp").value;
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log('User signed up!');
    });
}


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