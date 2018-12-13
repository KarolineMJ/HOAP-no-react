"use strict";

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

// show forms panel with button trigger
hiAdminBtn.addEventListener("click", showSignOutForm);
function showSignOutForm() {
  signoutForm.classList.toggle("hide");
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
