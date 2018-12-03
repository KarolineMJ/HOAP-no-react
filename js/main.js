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

const db = firebase.firestore();

//get data from firebase
db.collection("animals")
  .get()
  .then(anonymous => {
    anonymous.docs.forEach(doc => {
      renderAnimal(doc);
    });
  });
