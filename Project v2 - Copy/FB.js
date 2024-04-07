// Firebase implementation 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';


//TODO setup database
const firebaseConfig = {
  apiKey: "AIzaSyCzvJrhnnPtUBNBHwpAdtb7BRsdcwzLx0c",
  authDomain: "passwordmanager-8ea4d.firebaseapp.com",
  databaseURL: "(default)",
  projectId: "passwordmanager-8ea4d",
  storageBucket: "passwordmanager-8ea4d.appspot.com",
  messagingSenderId: "1050356190318",
  appId: "1:1050356190318:web:1a062440c93da4b0aeea7f",
  measurementId: "G-TSZFDKTFYG"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

export {FBsignIn, FBsignUp}; 
