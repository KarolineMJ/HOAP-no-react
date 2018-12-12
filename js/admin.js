"use strict";

const hiAdminBtn = document.querySelector(".hiAdminBtn");
const addAnimalBtn = document.querySelector(".addAnimalBtn");
const addToDoBtn = document.querySelector(".addToDoBtn");
const signoutForm = document.querySelector(".signOutForm");
const addAnimalForm = document.querySelector(".addAnimalForm");
const addToDoForm = document.querySelector(".addToDoForm");
const closeX = document.querySelectorAll(".close");

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

// general functions
closeX.forEach(closePanel);
function closePanel(x) {
  x.addEventListener("click", e => {
    e.target.parentElement.classList.add("hide");
  });
}
