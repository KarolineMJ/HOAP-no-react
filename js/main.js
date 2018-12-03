"use strict";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBpAvUcRTsrwq5HRkRbruyxmhkhfdLbiMk",
  authDomain: "hoap-exam2018.firebaseapp.com",
  databaseURL: "https://hoap-exam2018.firebaseio.com",
  projectId: "hoap-exam2018",
  storageBucket: "hoap-exam2018.appspot.com",
  messagingSenderId: "287614156735"
};
firebase.initializeApp(config);

function renderAnimal() {
  console.log("Hi Yan's animals");
}

const addPetForm = document.querySelector("#addPetForm");

//save data to firebase
addPetForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log(addPetForm.morning.checked);
  db.collection("animals").add({
    name: addPetForm.name.value,
    gender: addPetForm.gender.value,
    type: addPetForm.type.value,
    race: addPetForm.race.value,
    age: addPetForm.age.value,
    story: addPetForm.story.value,
    size: addPetForm.size.value,
    pregnant: addPetForm.pregnant.checked,
    pup: addPetForm.pup.checked,
    activity: [
      { morning: addPetForm.morning.checked },
      { afternoon: addPetForm.afternoon.checked },
      { evening: addPetForm.evening.checked },
      { extratraining: addPetForm.extra.checked }
    ],
    foodneed: addPetForm.foodneed.value
  });
});

const db = firebase.firestore();

//get data from firebase
db.collection("animals")
  .get()
  .then(anonymous => {
    anonymous.docs.forEach(doc => {
      renderAnimal(doc);
    });
  });
