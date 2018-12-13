"use strict";

const hiAdminBtn = document.querySelector(".hiAdminBtn");
const addAnimalBtn = document.querySelector(".addAnimalBtn");
const addToDoBtn = document.querySelector(".addToDoBtn");
const signoutForm = document.querySelector(".signOutForm");
const addAnimalForm = document.querySelector(".addAnimalForm");
const addToDoForm = document.querySelector(".addToDoForm");
const closeX = document.querySelectorAll(".close");
const allAnimalImgS = document.querySelectorAll(".animalImage");
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
addToDoBtn.addEventListener("click", showAddToDoForm);
function showAddToDoForm() {
  addToDoForm.classList.toggle("hide");
}

// open animal detail with click on animal image
allAnimalImgS.forEach(showAnimalDetail);
function showAnimalDetail(animalImage) {
  animalImage.addEventListener("click", e => {
    console.log(
      "get the id of animal of " +
        e.target +
        " and use it to fetch details in modal"
    );
    animalDetailModal.classList.toggle("hide");
  });
}

// general functions
closeX.forEach(closePanel);
function closePanel(x) {
  x.addEventListener("click", e => {
    e.target.parentElement.classList.add("hide");
  });
}
