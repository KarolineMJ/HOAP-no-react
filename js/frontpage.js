"use strict";

/*-------------------------------------------
Initialize Firebase
------------------------------------------*/
let config = {
  apiKey: "AIzaSyBpAvUcRTsrwq5HRkRbruyxmhkhfdLbiMk",
  authDomain: "hoap-exam2018.firebaseapp.com",
  databaseURL: "https://hoap-exam2018.firebaseio.com",
  projectId: "hoap-exam2018",
  storageBucket: "hoap-exam2018.appspot.com",
  messagingSenderId: "287614156735"
};
firebase.initializeApp(config);

// make a constant to the database
const db = firebase.firestore();

/*------------------------------------------
sign in user
------------------------------------------*/
//const for signin
const signipEmail = document.querySelector("#signipEmail");
const signipPassword = document.querySelector("#signipPassword");
const signinButton = document.querySelector("#signinButton");

//sign in a new user
signinButton.addEventListener("click", e => {
  e.preventDefault();

  firebase
    .auth()
    .signInWithEmailAndPassword(signipEmail.value, signipPassword.value)
    .then(() => {
      console.log("Succesfull signed in");
    })
    .catch(function(error) {
      console.log(error);
    });
});

/*-------------------------------------------
Display signin form
------------------------------------------*/

let alreadyMemberBtn = document.querySelector("#alreadyMemberBtn");
let signinForm = document.querySelector("#loginForm");
alreadyMemberBtn.addEventListener("click", openSigninForm);

function openSigninForm() {
  if (signinForm.style.display == "block") {
    signinForm.style.display = "none";
  } else {
    signinForm.style.display = "block";
  }
}

/*-------------------------------------------
Display right content if user
------------------------------------------*/

const frontpageContent = document.querySelector("#frontpageContent");
const signedInContent = document.querySelector("#signedInContent");
const memberBtns = document.querySelector("#sidebarBtns");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    frontpageContent.style.display = "none";
    signedInContent.style.display = "block";
    signinForm.style.display = "none";
    alreadyMemberBtn.style.display = "none";
    memberBtns.style.display = "block";
  } else {
    frontpageContent.style.display = "block";
    signedInContent.style.display = "none";
    alreadyMemberBtn.style.display = "block";
    memberBtns.style.display = "none";
  }
});

/*-------------------------------------------
Signout user
------------------------------------------*/

const signOutButton = document.querySelector("#signOut");

signOutButton.addEventListener("click", e => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Succesfull logout");
    })
    .catch(function(error) {
      // An error happened.
      console.log(err);
    });
});

/*-------------------------------------------
Open Modal
------------------------------------------*/
/*let inputfield = document.querySelectorAll("input");
let label = document.querySelectorAll("label");

inputfield.forEach(inputfield => {
  if (inputfield.placeholder !== "") {
    console.log("there is something");
  } else {
    console.log("there is nothing");
  }
});

*/
