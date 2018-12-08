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

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  } else {
  }
});

/*-------------------------------------------
Display signin form
------------------------------------------*/

let memberBtn = document.querySelector("#alreadyMemberBtn");
let signinForm = document.querySelector("#loginForm");
memberBtn.addEventListener("click", openSigninForm);

function openSigninForm() {
  signinForm.classList.toggle("visible");
}

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
