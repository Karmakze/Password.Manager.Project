
import {FBsignIn, FBsignUp, FBlogout, addToDB, deleteFromDB} from './FB.js';

//event listners 

// document.addEventListener("DOMContentLoaded", function () { 
//     // Load existing passwords from localStorage on page load
//    loadPasswords();
// });

document.getElementById("formSubmit").addEventListener("click", function () {
    //validateEntry();
    validateEntry();
});

document.getElementById("signUpButton").addEventListener("click", function () {
    FBsignUp();
});

document.getElementById("loginButton").addEventListener("click", function () {
    FBsignIn();
});

document.getElementById("logoutButton").addEventListener("click", function () {
    FBlogout();
});



function addPassword() {
    // Get form values
    var website = document.getElementById("website").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // adds to firebaseDB
    addToDB("default", website, username, password, "www.google.com")  //unhardcode 

    // Clear the form
    document.getElementById("passwordForm").reset();

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