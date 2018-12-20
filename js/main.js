"use strict";

// Initialize Firebase
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

//constant the animals will be placed in
const animalList = document.querySelector("#animalList");

//constant fot the template
const animalTemp = document.querySelector("#animalTemp").content;

//render the animals from the database into the website
function renderAnimal(doc) {
  const clone = animalTemp.cloneNode(true);
  clone.querySelector(".petName").textContent = doc.data().name;
  clone.querySelector(".petType").textContent = doc.data().type;
  clone.querySelector(".petAge span").textContent = doc.data().age;
  clone.querySelector(".petGender").textContent = doc.data().gender;
  clone.querySelector(".petRace").textContent = doc.data().race;
  clone.querySelector(".petStory").textContent = doc.data().story;
  clone.querySelector(".petSize").textContent = doc.data().size;
  clone.querySelector(".petPregnant").textContent = doc.data().pregnant
    ? "Pregnant"
    : "";
  clone.querySelector(".petPup").textContent = doc.data().pup ? "Pup" : "";
  clone.querySelector(".petActivity li:nth-of-type(1)").textContent = doc.data()
    .activity[0].morning
    ? "Morning"
    : "x";
  clone.querySelector(".petActivity li:nth-of-type(2)").textContent = doc.data()
    .activity[1].afternoon
    ? "Afternoon"
    : "x";
  clone.querySelector(".petActivity li:nth-of-type(3)").textContent = doc.data()
    .activity[2].evening
    ? "Evening"
    : "x";
  clone.querySelector(".petActivity li:nth-of-type(4)").textContent = doc.data()
    .activity[3].extratraining
    ? "Extra"
    : "x";

  clone.querySelector(".petFoodneed").textContent = doc.data().foodneed + "kr";

  //append the cloned content to the div
  animalList.appendChild(clone);
}

const signUpForm = document.querySelector("#signUp");
const signInForm = document.querySelector("#signIn");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    signInForm.style.display = "none";
    signUpForm.style.display = "none";
    signOutButton.style.display = "block";
    //get data from firebase
    db.collection("animals")
      .get()
      .then(anonymous => {
        anonymous.docs.forEach(doc => {
          renderAnimal(doc);
        });
      });
  } else {
    signInForm.style.display = "block";
    signUpForm.style.display = "block";
    signOutButton.style.display = "none";
    animalList.innerHTML = "";
    signInEmail.value = "";
    signInPassword.value = "";
    signUpEmail.value = "";
    signUpNickname.value = "";
    signUpPassword.value = "";
  }
});

//const for signup
const signUpEmail = document.querySelector("#signUp input[type='email']");
const signUpPassword = document.querySelector("#signUp input[type='password']");
const signUpNickname = document.querySelector("#signUp input[type='text']");

const signUpButton = document.querySelector("#signUp .submit");

//sign up a new user
signUpButton.addEventListener("click", e => {
  e.preventDefault();

  firebase
    .auth()
    .createUserWithEmailAndPassword(signUpEmail.value, signUpPassword.value)
    .then(() => {
      console.log("Succesfull signup");

      db.collection("member").add({
        email: signUpEmail.value,
        nickname: signUpNickname.value,
        permission: "none"
      });
    })
    .catch(function(error) {
      console.log(error);
    });
});

//const for signin
const signInEmail = document.querySelector("#signIn input[type='email']");
const signInPassword = document.querySelector("#signIn input[type='password']");
const signInButton = document.querySelector("#signIn .submit");

//sign in a new user
signInButton.addEventListener("click", e => {
  e.preventDefault();

  firebase
    .auth()
    .signInWithEmailAndPassword(signInEmail.value, signInPassword.value)
    .then(() => {
      console.log("Succesfull signed in");
    })
    .catch(function(error) {
      console.log(error);
    });
});

//const for logout
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

// //form for adding a new pet to the db
// const addPetForm = document.querySelector("#addPetForm");

// //save data to firestore when clicking on the button
// addPetForm.addEventListener("submit", e => {
//   e.preventDefault();

//   //add to the specific collection in firestore
//   db.collection("animals").add({
//     name: addPetForm.name.value,
//     type: addPetForm.type.value,
//     gender: addPetForm.gender.value,
//     age: addPetForm.age.value,
//     race: addPetForm.race.value,
//     story: addPetForm.story.value,
//     size: addPetForm.size.value,
//     pregnant: addPetForm.pregnant.checked,
//     pup: addPetForm.pup.checked,
//     activity: [
//       { morning: addPetForm.morning.checked },
//       { afternoon: addPetForm.afternoon.checked },
//       { evening: addPetForm.evening.checked },
//       { extratraining: addPetForm.extra.checked }
//     ],
//     foodneed: addPetForm.foodneed.value
//   });
// });

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
