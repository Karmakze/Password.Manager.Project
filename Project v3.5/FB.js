// Firebase implementation 

//TODO 2fa ( not possible free plan ), profile refresh fix in logout/login, mobile support, prompt for updating, hide loginbx pass, URL linked, bring x on profiles inline and delete confirmation, 


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,

  } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, set, onValue, remove, off, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getFirestore, enableIndexedDbPersistence} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";



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
var selectedProfile = { value : null };
await setPersistence(auth, browserLocalPersistence);
const firestore = getFirestore();
enableIndexedDbPersistence(firestore); // method may become outdated soon


//listners 
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

document.getElementById("createProfileBtn").addEventListener("click", function () {
  addProfile();
});

document.getElementById("searchBtn").addEventListener("click", function () {
  createUpdateListner();
});

document.getElementById("clearBtn").addEventListener("click", function () {
  createUpdateListner();
});

document.getElementById("resetBtn").addEventListener("click", function () {
  resetPassword();
});

document.getElementById("addKeywordBtn").addEventListener("click", function () {
  addKeyword();
});

document.getElementById("genPassBtn").addEventListener("click", function () {
  generatePass();
});


//check if user is signed in if so get data from database and display it
// let currentListenerProfile = null;
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // User is signed in
//       console.log('A user is signed in!');
//       if (currentListenerProfile) {
//         const oldRefpf = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + selectedProfile.value);
//         off(oldRefpf, 'value', currentListenerProfile);
//       }
//       currentListenerProfile = (snapshot) => {
//       const pfRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles");
//       onValue(pfRef, (snapshot) => {
//         const data = snapshot.val();
//         var parent = document.getElementById("profileInsert")
//         if (data) {
//           if (parent !== null) {
//             // Remove old profile buttons
//             var oldButtons = document.querySelectorAll(".profile-button");
//             oldButtons.forEach(function(button) {
//               button.remove();
//             });
            
//             //creates button for each profile
//             Object.keys(data).forEach((key) => {
//               var profileButton = document.createElement("button");
//               profileButton.style.backgroundColor = "rgb(0,0,150)";
//               profileButton.addEventListener("mouseover", function() {
//                 this.style.backgroundColor = "rgb(0,0,100)";
//               });
//               profileButton.addEventListener("mouseout", function() {
//                 this.style.backgroundColor = "rgb(0,0,150)";
//               });
//               profileButton.textContent = key;
//               profileButton.className = "profile-button";
//               profileButton.onclick = function() {
//                 selectedProfile.value = key;
//                 createUpdateListner();
//               }
//               parent.appendChild(profileButton);

//               var deleteProfileButton = document.createElement("button");
//               deleteProfileButton.textContent = "X";
//               deleteProfileButton.style.backgroundColor = "rgb(150,0,0)";
//               deleteProfileButton.className = "profile-button";
//               deleteProfileButton.onclick = function() {
//                 deleteProfile(key);
//               }
//               parent.appendChild(deleteProfileButton);
              
//             });
//           }
//         }
//       }, (error) => {
//         console.error('Error:', error);
//       });
//     }
//       const pfRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + selectedProfile.value); 
//       onValue(pfRef, currentListenerProfile);
//     }
    
// });

let currentListenerProfile = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log('A user is signed in!');
      if (currentListenerProfile) {
        const oldRefpf = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + selectedProfile.value);
        off(oldRefpf, 'value', currentListenerProfile);
      }
      currentListenerProfile = (snapshot) => {
      const pfRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles");
      onValue(pfRef, (snapshot) => {
        const data = snapshot.val();
        var parent = document.getElementById("profileInsert")
        if (data) {
          if (parent !== null) {
            // Remove old profile buttons
            var oldButtons = document.querySelectorAll(".profile-button");
            oldButtons.forEach(function(button) {
              button.remove();
            });
            
            //creates button for each profile
            Object.keys(data).forEach((key) => {
              // Create a new div for each profile
              var tempInps = document.createElement("div");
              tempInps.style.display = "flex";
              tempInps.style.justifyContent = "space-between";

              var profileButton = document.createElement("button");
              profileButton.style.backgroundColor = "rgb(0,0,150)";
              profileButton.addEventListener("mouseover", function() {
                this.style.backgroundColor = "rgb(0,0,100)";
              });
              profileButton.addEventListener("mouseout", function() {
                this.style.backgroundColor = "rgb(0,0,150)";
              });
              profileButton.textContent = key;
              profileButton.className = "profile-button";
              profileButton.style.width = "100%"; 
              profileButton.onclick = function() {
                selectedProfile.value = key;
                createUpdateListner();
              }
              tempInps.appendChild(profileButton);

              var deleteProfileButton = document.createElement("button");
              deleteProfileButton.textContent = "X";
              deleteProfileButton.style.backgroundColor = "rgb(150,0,0)";
              deleteProfileButton.className = "profile-button";
              deleteProfileButton.onclick = function() {
                deleteProfile(key);
              }
              tempInps.appendChild(deleteProfileButton);

              // Append the new div to the parent
              parent.appendChild(tempInps);
            });
          }
        }
      }, (error) => {
        console.error('Error:', error);
      });
    }
      const pfRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + selectedProfile.value); 
      onValue(pfRef, currentListenerProfile);
    }
});


let currentListenerData = null;
function createUpdateListner() {
  if (currentListenerData) {
    const oldRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + selectedProfile.value);
    off(oldRef, 'value', currentListenerData);
  }
  currentListenerData = (snapshot) => {
    const data = snapshot.val();
    //console.log(data.n.Password);
    var tableBody = document.querySelector("#passwordTable tbody");
    tableBody.innerHTML = "";
    // check if data available if it is record and display it
    if (data) {
      const secretKey = 'N3wC0mpl3x$3cr3tK3y!r38r238yer9823r9832'
      var searchQuery = document.getElementById("Search").value.toLowerCase();
      Object.keys(data).forEach((key) => {
        if (key.toLowerCase().includes(searchQuery) || data[key].Username.toLowerCase().includes(searchQuery)) {
          //console.log('Key:', key, 'Value:', data[key]);
          // temp variable pointing to row
          var row = tableBody.insertRow();
          // dispalys website
          var cellWebsite = row.insertCell(0);
          //cellWebsite.textContent = key;
          var link = document.createElement('a');
          link.href = data[key].URL; 
          link.textContent = key;

          // Append the link to the cell
          cellWebsite.appendChild(link);
          // displays username
          var cellUsername = row.insertCell(1);
          const username = CryptoJS.AES.decrypt(data[key].Username, secretKey).toString(CryptoJS.enc.Utf8);
          cellUsername.textContent = username;
          // dispalys password
          var cellPassword = row.insertCell(2);
          const password = CryptoJS.AES.decrypt(data[key].Password, secretKey).toString(CryptoJS.enc.Utf8);
          cellPassword.textContent = '••••••••';
        
          var cellShowAction = row.insertCell(3);
          var showButton = document.createElement("button");
          showButton.textContent = "👁";
          showButton.onclick = function () {
            if (cellPassword.textContent === password) {
              cellPassword.textContent = '••••••••';
            } else {
              cellPassword.textContent = password;
            }
          };
          cellShowAction.appendChild(showButton);

          var cellDelAction = row.insertCell(4);
          var deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.style.backgroundColor = "rgb(150,0,0)";
          deleteButton.onclick = function () {
            deleteFromDB(key, selectedProfile.value);
          };
          cellDelAction.appendChild(deleteButton);
          // TODO update prompt instead of using add form
          var cellUpdateAction = row.insertCell(5);
          var updateButton = document.createElement("button");
          updateButton.textContent = "Update";
          updateButton.style.backgroundColor = "rgb(0,0,150)";
          updateButton.onclick = function () {
            addToDB(selectedProfile.value, key, document.getElementById("username").value, document.getElementById("password").value, "newURL");
          };
          cellUpdateAction.appendChild(updateButton);

          var cellPassStat = row.insertCell(6);
          var score = scorePassword(password);
          cellPassStat.textContent = score;
          if (score < 40) {
            cellPassStat.style.color = "rgb(250,0,0)";
          }
          else if (score < 60) {
            cellPassStat.style.color = "rgb(250,250,0)";
          }
          else if (score < 90) {
            cellPassStat.style.color = "rgb(0,250,0)";
          }
          else if (score > 89){
            cellPassStat.style.color = "rgb(0,250,250)";
          }

        }

        
        

      });
    }
    }, (error) => {
      console.error('Error:', error);
  };
  const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + selectedProfile.value); 
  onValue(dbRef, currentListenerData);
} 




function FBsignIn() {
    const email = document.getElementById("usernameInp").value;
    const password = document.getElementById("passwordInp").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log('User signed in and email is verified!');
        alert('Sign in successful!');
        document.getElementById("usernameInp").value = "";
        document.getElementById("passwordInp").value = "";
      } else {
        console.log('email is not verified!');
        alert('email is not verified!');
        sendEmailVerification(user)
        .then(() => {
          alert("Verification email sent to: " + email + " please verify your email address to continue");
        })
        .catch((error) => {
          console.error('Error sending verification email:', error);
        });
        FBlogout();

      }
      console.log('User signed in!');
  
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error:', errorCode, errorMessage);
      alert("Sign in failed! Check your email and password and try again.");
    });
}

function resetPassword() {
  const email = prompt("Enter email to reset password:");
  sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log('Password reset email sent!');
    alert('Password reset email sent! Check your email to reset your password.');
  })
  .catch((error) => {
    console.error('Error sending password reset email:', error);
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
      //verify email
      sendEmailVerification(user)
      .then(() => {
        alert("Verification email sent to: " + email + " please verify your email address to continue");
      })
      .catch((error) => {
        console.error('Error sending verification email:', error);
      });

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
        alert('User Signed Out!');
    }).catch((error) => {
        console.log('Error:', error);
    });
}

async function addToDB(profile, website, username, password, URL) {
  const secretKey = 'N3wC0mpl3x$3cr3tK3y!r38r238yer9823r9832'
  const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
  const encryptedUsername = CryptoJS.AES.encrypt(username, secretKey).toString();

  const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + profile + "/" + website);
  
  // Get the data at the specified location
  var snapshot = await get(dbRef);
  if (snapshot.exists()) {
    alert("This website already exists, do you want to update it? or if you want to add another instance of the website you could add (x) to the end for example 'website(1)'");
  } else {
    set(ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + profile + "/" + website), {
      Username: encryptedUsername,
      Password: encryptedPassword,
      URL: URL
    });
  }

}

function addPassword() {
  // Get form values
  var website = document.getElementById("website").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var Url = document.getElementById("URL").value;
  // adds to firebaseDB
  addToDB(selectedProfile.value, website, username, password, Url)  //unhardcode 

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

// TODO update button (maybe)


//TODO delete button
function deleteFromDB(website, profile) {
  const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + profile + "/" + website); 
  remove(dbRef)
  .then(() => {
    console.log('Data deleted!');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function addProfile() {
  var profileName = prompt("Enter profile name:");
  if (profileName !== null) {
    const secretKey = 'N3wC0mpl3x$3cr3tK3y!r38r238yer9823r9832';
    const encryptedPassword = CryptoJS.AES.encrypt("password", secretKey).toString();
    const encryptedUsername = CryptoJS.AES.encrypt("username", secretKey).toString();
    const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + profileName);
    var snapshot = await get(dbRef);
    if (snapshot.exists()) {
      alert("This profile already exists, do you want to update it? or if you want to add another instance of the profile you could add (x) to the end for example 'profile(1)'");
    } else {
      set(ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + profileName + "/Example"), {
        Username: encryptedUsername,
        Password: encryptedPassword,
        URL: "https://www.google.com/",
      });
    }
  }
}

function deleteProfile(profile) {
  var choice = confirm("Are you sure you want to delete this profile?");
  const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/profiles/" + profile); 
  if (choice) {
    remove(dbRef)
    .then(() => {
      console.log('Data deleted!');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  } else {
    console.log('Data not deleted!');
  }
}

function scorePassword(pass) {
  var score = 0;
  if (!pass)
    return score;

  // award every unique letter until 5 repetitions
  var letters = new Object();
  for (var i=0; i<pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  // bonus points for mixing it up
  var variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  }

  var variationCount = 0;
  for (var check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return parseInt(score);
}

function generatePass() {
  const dbref = ref(db, 'users/' + auth.currentUser.uid + "/Keywords");
  const secretKey = 'N3wC0mpl3x$3cr3tK3y!r38r238yer9823r9832';
  onValue(dbref, (snapshot) => {
    try {
      const count = snapshot.size - 1;
      const data = snapshot.val();
      const keys = Object.keys(data);
    
      var rndNum1 = getRndNum(0, count);
      var rndNum2 = getRndNum(0, count);
      var rndNum3 = getRndNum(0, count);
      while ((rndNum1 === rndNum2 || rndNum1 === rndNum3)) {
        rndNum1 = getRndNum(0, count);
      }
      while ((rndNum2 === rndNum1 || rndNum2 === rndNum3)) {
        rndNum2 = getRndNum(0, count);
      }
      while ((rndNum3 === rndNum1 || rndNum3 === rndNum2)) {
        rndNum3 = getRndNum(0, count);
      }
      

      const endNum = Math.floor(Math.random() * 9000) + 1000;
      const part1 = CryptoJS.AES.decrypt(keys[rndNum1].replace(/_/g, '/'), secretKey).toString(CryptoJS.enc.Utf8);
      const part2 = CryptoJS.AES.decrypt(keys[rndNum2].replace(/_/g, '/'), secretKey).toString(CryptoJS.enc.Utf8);
      const part3 = CryptoJS.AES.decrypt(keys[rndNum3].replace(/_/g, '/'), secretKey).toString(CryptoJS.enc.Utf8);
      const Pass = part1 + part2 + part3 + endNum + "!_";
      let inputElement = document.getElementById('password');
      inputElement.value = Pass;
  } catch (error) {
    alert("You need to add at least 3 keywords to generate a password");
    return;
  }
  }) 

  
  
}

// async function addKeyword() {
//   var keywordUnencrypted = prompt("Enter keyword:");
//   const secretKey = 'N3wC0mpl3x$3cr3tK3y!r38r238yer9823r9832';
//   var keyword = CryptoJS.AES.encrypt(keywordUnencrypted, secretKey).toString().replace(/\//g, '_');
//   const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/keywords/" + keyword);
//   var snapshot = await get(dbRef);
//   if (snapshot.exists()) {
//     alert("You already have this keyword registered");
//   } else {
//     set(ref(db, 'users/' + auth.currentUser.uid + "/Keywords/" + keyword), {
//       keyword: keyword
//     });
//   }

// }
async function addKeyword() {
  var keywordUnencrypted = prompt("Enter keyword:");
  const secretKey = 'N3wC0mpl3x$3cr3tK3y!r38r238yer9823r9832';
  var keyword = CryptoJS.AES.encrypt(keywordUnencrypted, secretKey).toString().replace(/\//g, '_');
  const dbRef = ref(db, 'users/' + auth.currentUser.uid + "/keywords/" + keyword);
  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      alert("You already have this keyword registered");
    } else {
      set(ref(db, 'users/' + auth.currentUser.uid + "/Keywords/" + keyword), {
        keyword: keyword
      });
    }
  });
}

function getRndNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}