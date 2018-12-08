"use strict";
let placeholders = document.querySelectorAll("input").placeholder;

function checkForPlaceholder() {
  if (placeholders !== "") {
    console.log("there is something");
    placeholders = "hi mom";
  }
}
checkForPlaceholder();

let memberBtn = document.querySelector("#alreadyMemberBtn");
let signinForm = document.querySelector(".loginForm");
memberBtn.addEventListener("click", openSigninForm);

function openSigninForm() {
  signinForm.classList.toggle("visible");
}
