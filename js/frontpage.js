"use strict";

window.addEventListener("DOMContentLoaded", init);
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
const settings = {
  timestampsInSnapshots: true
};
db.settings(settings);

function init() {
  const adminSection = document.querySelector("#admin");

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
  const signoutAdminBtn = document.querySelector("#signoutAdmin");
  const footer = document.querySelector("#footer");

  firebase.auth().onAuthStateChanged(function(user) {
    if (user && user.email === "admin@admin.com") {
      adminSection.style.display = "block";
      frontpageContent.style.display = "none";
      signedInContent.style.display = "none";
      signinForm.style.display = "none";
      alreadyMemberBtn.style.display = "none";
      memberBtns.style.display = "none";
      signoutAdminBtn.style.display = "block";
      footer.style.display = "none";
      db.collection("toDoList")
        .get()
        .then(showTasks => {
          showTasks.docs.forEach(doc => {
            renderTask(doc);
          });
        });
    } else if (user) {
      adminSection.style.display = "none";
      frontpageContent.style.display = "none";
      signedInContent.style.display = "block";
      signinForm.style.display = "none";
      alreadyMemberBtn.style.display = "none";
      memberBtns.style.display = "block";
      signoutAdminBtn.style.display = "none";
    } else {
      adminSection.style.display = "none";
      frontpageContent.style.display = "block";
      signedInContent.style.display = "none";
      alreadyMemberBtn.style.display = "block";
      memberBtns.style.display = "none";
      signoutAdminBtn.style.display = "none";
    }
  });

  /*-------------------------------------------
Render tasks from database into website 
--------------------------------------------*/

  function renderTask(doc) {
    let taskList = document.querySelector(".toDoListWrapper");
    let taskDiv = document.createElement("div");
    let task = document.createElement("span");
    let taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";

    taskDiv.setAttribute("data-id", doc.id);
    task.textContent = doc.data().task;

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(task);
    taskList.appendChild(taskDiv);
  }
  //renderTask(doc);

  /*-------------------------------------------
Signout user
------------------------------------------*/

  const signOutButton = document.querySelector("#signOut");
  signoutAdminBtn.addEventListener("click", signout);
  signOutButton.addEventListener("click", signout);
  function signout() {
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
  }

  /*-------------------------------------------
Sign up user
------------------------------------------*/
  const signupName = document.querySelector("#signupName");
  const signupPassword = document.querySelector("#signupPassword");
  const signupEmail = document.querySelector("#signupEmail");
  const signupBtn = document.querySelector("#signupBtn");

  signupBtn.addEventListener("click", e => {
    e.preventDefault();

    //go to preferences page

    firebase
      .auth()
      .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
      .then(() => {
        console.log("Succesfull signup");

        db.collection("member").add({
          email: signupEmail.value,
          nickname: signupName.value,
          permission: "none"
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  /*-------------------------------------------
                Add to do task
------------------------------------------*/

  const toDoBtn = document.querySelector(".addToDoBtn");
  const toDoInput = document.querySelector(".subsectionHeader span input");

  toDoBtn.addEventListener("click", e => {
    console.log("hello");
    e.preventDefault();
    db.collection("toDoList").add({
      task: toDoInput.value,
      writer: "admin",
      type: "To Do"
    });
    toDoInput.value = "";
  });

  /*-------------------------------------------
Animation - Intersection Observer
------------------------------------------*/

  const animatedSection = document.querySelector("#aboutUs");

  let observer = new IntersectionObserver(entry => {
    if (entry.intersectionRatio > 0) {
      console.log("in view");
    } else {
      console.log("out of view");
    }
  });

  observer.observe(animatedSection);

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
}
