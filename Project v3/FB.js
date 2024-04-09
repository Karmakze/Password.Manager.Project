// Firebase implementation 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
  } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, set, onValue, remove} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

//TODO setup database
const firebaseConfig = {
  apiKey: "AIzaSyCzvJrhnnPtUBNBHwpAdtb7BRsdcwzLx0c",
  authDomain: "passwordmanager-8ea4d.firebaseapp.com",
  databaseURL: "https://passwordmanager-8ea4d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "passwordmanager-8ea4d",
  storageBucket: "passwordmanager-8ea4d.appspot.com",
  messagingSenderId: "1050356190318",
  appId: "1:1050356190318:web:1a062440c93da4b0aeea7f",
  measurementId: "G-TSZFDKTFYG"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

//listners 
//check if user is signed in if so get data from database and display it

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log('A user is signed in!');
      const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/" + "default"); 

      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        //console.log(data.n.Password);
        var tableBody = document.querySelector("#passwordTable tbody");
        tableBody.innerHTML = "";
        // check if data available if it is record and display it
        if (data) {
          Object.keys(data).forEach((key) => {
            //console.log('Key:', key, 'Value:', data[key]);
            // temp variable pointing to row
            var row = tableBody.insertRow();
            // dispalys website
            var cellWebsite = row.insertCell(0);
            cellWebsite.textContent = key;
            // displays username
            var cellUsername = row.insertCell(1);
            cellUsername.textContent = data[key].Username;
            // dispalys password
            var cellPassword = row.insertCell(2);
            cellPassword.textContent = data[key].Password;
            // displays delete button
            var cellAction = row.insertCell(3);
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
              deleteFromDB(key);
            };
            cellAction.appendChild(deleteButton);
            // Add update button
            var cellUpdateAction = row.insertCell(4);
            var updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.onclick = function () {
              addToDB("default", key, document.getElementById("username").value, document.getElementById("password").value, "newURL");
            };
            cellUpdateAction.appendChild(updateButton);
          });
        }

      }, (error) => {
          console.error('Error:', error);
      });
    } else {
      // No user is signed in
      console.log('No user signed in!');
    }
});




//TODO setup authentication and retrieve user info
function FBsignIn() {
    const email = document.getElementById("usernameInp").value;
    const password = document.getElementById("passwordInp").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log('User signed in!');
  
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error:', errorCode, errorMessage);
    });
}

function FBsignUp() {
    const email = document.getElementById("usernameInp").value;
    const password = document.getElementById("passwordInp").value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed Up
      const user = userCredential.user;
      console.log('User signed up!');

      // set a user reference in the database
      set(ref(db, 'users/' + user.uid + '/Uinfo'), {
        email: email,
        uid: user.uid
      });
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error:', errorCode, errorMessage);
    });
}

// TODO make it clear the databse
function FBlogout () {
    auth.signOut().then(() => {
        console.log('User signed out!');
    }).catch((error) => {
        console.log('Error:', error);
    });
}
function addToDB(profile, website, username, password, URL) {
    set(ref(db, 'users/' + auth.currentUser.uid + "/" + profile + "/" + website), {
      Username: username,
      Password: password,
      URL: URL
    });

}

// TODO update button (maybe)


//TODO delete button
function deleteFromDB(website) {
  const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/" + "default" + "/" + website); 
  remove(dbRef)
  .then(() => {
    console.log('Data deleted!');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

//TODO read data from database


export {FBsignIn, FBsignUp, FBlogout, addToDB, deleteFromDB}; 
