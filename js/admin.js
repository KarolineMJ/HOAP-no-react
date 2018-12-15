"use strict";

// html elements
const hiAdminBtn = document.querySelector(".hiAdminBtn");
const addAnimalBtn = document.querySelector(".addAnimalBtn");
const addToDoBtn = document.querySelector(".addToDoBtn");
const signoutForm = document.querySelector(".signOutForm");
const addAnimalForm = document.querySelector(".addAnimalForm");
const closeX = document.querySelectorAll(".close");
const allAnimalImgS = document.querySelectorAll(".animalImage");
const closeModalBtn = document.querySelector(".buttons .closeModal");
const editAnimalBtn = document.querySelector(".editAnimal");
const deleteAnimalBtn = document.querySelector(".deleteAnimal");
const animalDetailModal = document.querySelector(".animalDetailModal");

// db setup
// const config2 = {
//   apiKey: "AIzaSyBHWNmZGfId2xH3qKJMWdGyqRcIdn_FgCU",
//   authDomain: "hoap-122b3.firebaseapp.com",
//   databaseURL: "https://hoap-122b3.firebaseio.com",
//   projectId: "hoap-122b3",
//   storageBucket: "hoap-122b3.appspot.com",
//   messagingSenderId: "25488209964"
// };
// firebase.initializeApp(config2);
// const database = firebase.firestore();
// get animal data from firebase
db.collection("animals")
  .get()
  .then(res => {
    res.docs.forEach(doc => {
      //console.log(doc);
      //      buildAnimalList(doc);
    });
  });
// build column of each animal
function buildAnimalList(entry) {
  alert("mmmm");
  const animalName = entry.data().name;
  const animalImageFile = entry.data().image[0];
  const columns = document.querySelector(".tableWrapper .columns");
  let column = document.createElement("div");
  column.classList.add("column");
  let animalImageDiv = document.createElement("div");
  animalImageDiv.classList.add("animalImage");
  let animalImage = document.createElement("img");
  animalImage.setAttribute("src", animalImageFile);
  animalImage.setAttribute("title", animalName);
  animalImageDiv.appendChild(animalImage);
  column.appendChild(animalImageDiv);
  // get daily task of this animal from another collection in database
  database
    .collection("daily")
    .where("name", "==", animalName)
    .get()
    .then(res => {
      res.docs.forEach(doc => {
        ///////////////////// need to DRY these
        if (doc.data().morning === false) {
          let row = document.createElement("div");
          row.classList.add("row");
          let noTaskImage = document.createElement("img");
          noTaskImage.setAttribute("src", "img/notask.png");
          row.appendChild(noTaskImage);
          column.appendChild(row);
          columns.appendChild(column);
        } else {
          let row = document.createElement("div");
          row.classList.add("row");
          let taskCheckbox = document.createElement("input");
          taskCheckbox.setAttribute("type", "checkbox");
          let byWhom = document.createElement("span");
          byWhom.classList.add("memberName");
          if (doc.data().morningMember !== "") {
            byWhom.textContent = doc.data().morningMember;
          }
          row.appendChild(taskCheckbox);
          row.appendChild(byWhom);
          column.appendChild(row);
          columns.appendChild(column);
        }
        ////////////////////////////////

        if (doc.data().afternoon === false) {
          let row = document.createElement("div");
          row.classList.add("row");
          let noTaskImage = document.createElement("img");
          noTaskImage.setAttribute("src", "img/notask.png");
          row.appendChild(noTaskImage);
          column.appendChild(row);
          columns.appendChild(column);
        } else {
          let row = document.createElement("div");
          row.classList.add("row");
          let taskCheckbox = document.createElement("input");
          taskCheckbox.setAttribute("type", "checkbox");
          let byWhom = document.createElement("span");
          byWhom.classList.add("memberName");
          if (doc.data().morningMember !== "") {
            byWhom.textContent = doc.data().afternoonMember;
          }
          row.appendChild(taskCheckbox);
          row.appendChild(byWhom);
          column.appendChild(row);
          columns.appendChild(column);
        }

        /////////////////////////////
        if (doc.data().evening === false) {
          let row = document.createElement("div");
          row.classList.add("row");
          let noTaskImage = document.createElement("img");
          noTaskImage.setAttribute("src", "img/notask.png");
          row.appendChild(noTaskImage);
          column.appendChild(row);
          columns.appendChild(column);
        } else {
          let row = document.createElement("div");
          row.classList.add("row");
          let taskCheckbox = document.createElement("input");
          taskCheckbox.setAttribute("type", "checkbox");
          let byWhom = document.createElement("span");
          byWhom.classList.add("memberName");
          if (doc.data().morningMember !== "") {
            byWhom.textContent = doc.data().eveningMember;
          }
          row.appendChild(taskCheckbox);
          row.appendChild(byWhom);
          column.appendChild(row);
          columns.appendChild(column);
        }
        /////////////////////////////
        if (doc.data().traning === false) {
          let row = document.createElement("div");
          row.classList.add("row");
          let noTaskImage = document.createElement("img");
          noTaskImage.setAttribute("src", "img/notask.png");
          row.appendChild(noTaskImage);
          column.appendChild(row);
          columns.appendChild(column);
        } else {
          let row = document.createElement("div");
          row.classList.add("row");
          let taskCheckbox = document.createElement("input");
          taskCheckbox.setAttribute("type", "checkbox");
          let byWhom = document.createElement("span");
          byWhom.classList.add("memberName");
          if (doc.data().morningMember !== "") {
            byWhom.textContent = doc.data().trainingMember;
          }
          row.appendChild(taskCheckbox);
          row.appendChild(byWhom);
          column.appendChild(row);
          columns.appendChild(column);
        }
        /////////////////////////////
        if (doc.data().extra === "") {
          let row = document.createElement("div");
          row.classList.add("row");
          let noTaskImage = document.createElement("img");
          noTaskImage.setAttribute("src", "img/notask.png");
          row.appendChild(noTaskImage);
          column.appendChild(row);
          columns.appendChild(column);
        } else {
          let row = document.createElement("div");
          row.classList.add("row");
          let extraDesc = document.createElement("p");
          extraDesc.textContent = doc.data().extra;
          let taskCheckbox = document.createElement("input");
          taskCheckbox.setAttribute("type", "checkbox");
          let byWhom = document.createElement("span");
          byWhom.classList.add("memberName");
          if (doc.data().extraMember !== "") {
            byWhom.textContent = doc.data().extraMember;
          }
          row.appendChild(extraDesc);
          row.appendChild(taskCheckbox);
          row.appendChild(byWhom);
          column.appendChild(row);
          columns.appendChild(column);
        }
      });
    });
  //   if (entry.data().morning) clone.querySelector(".morning");
  columns.appendChild(column);
}

// show forms panel with button trigger
hiAdminBtn.addEventListener("click", signoutAdmin);
function signoutAdmin(user) {
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Succesfull logout");
      console.log(user);
      //      window.location = "index.html";
    })
    .catch(function(error) {
      // An error happened.
      console.log(err);
    });
}

addAnimalBtn.addEventListener("click", showAddAnimalForm);
function showAddAnimalForm() {
  addAnimalForm.classList.toggle("hide");
}
addToDoBtn.addEventListener("click", addToDo);
function addToDo() {
  console.log("add a to do to the list");
}

// open animal detail modal with click on animal image
allAnimalImgS.forEach(showAnimalDetail);
function showAnimalDetail(animalImage) {
  animalImage.addEventListener("click", e => {
    getAnimalInfo();
    if (animalDetailModal.classList.contains("hide")) {
      animalDetailModal.classList.remove("hide");
    }
  });
}
// edit animal detail
editAnimalBtn.addEventListener("click", editAnimal);
function editAnimal() {
  console.log("edit animal, write to db");
  closeModal();
  updateAnimalList();
}
// delete animal
deleteAnimalBtn.addEventListener("click", deleteAnimal);
function deleteAnimal() {
  console.log("delete animal, write to db");
  closeModal();
  updateAnimalList();
}
// close modal with button click
closeModalBtn.addEventListener("click", () => {
  closeModal();
});
// general functions
// close panal with click on X
closeX.forEach(closePanel);
function closePanel(x) {
  x.addEventListener("click", e => {
    e.target.parentElement.classList.add("hide");
  });
}
// click animal detail modal
function closeModal() {
  animalDetailModal.classList.add("hide");
}
// update animal list
function updateAnimalList() {
  console.log(
    "re-generate animal list, remove deleted animal / update to editted info "
  );
}
// get animal info
function getAnimalInfo() {
  console.log(
    "get the id of clicked animal and use it to fetch details in modal"
  );
}
