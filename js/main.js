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

const animalList = document.querySelector("#animalList");
const animalTemp = document.querySelector("#animalTemp").content;

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

  animalList.appendChild(clone);
}

const addPetForm = document.querySelector("#addPetForm");

//save data to firebase
addPetForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log(addPetForm.morning.checked);
  db.collection("animals").add({
    name: addPetForm.name.value,
    type: addPetForm.type.value,
    gender: addPetForm.gender.value,
    age: addPetForm.age.value,
    race: addPetForm.race.value,
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
