"use strict";

const signInBtn = document.querySelector("#signIn");
const signOutBtn = document.querySelector(".signOutBtn");
const cancelBtn = document.querySelector(".cancelBtn");
const hi = document.querySelector("#hi");
const userPanel = document.querySelector("#userPanel");
const signInForm = document.querySelector("#signInForm");
const settingForm = document.querySelector("#settingForm");
const adminSection = document.querySelector("#admin");
const forNewUserSectionS = document.querySelectorAll(".forNewUser");
const userSection = document.querySelector("#user");

document.addEventListener("DOMContentLoaded", init);
function init() {
  // check if session already exist at load
  const activeUser = window.sessionStorage.getItem("user");
  if (activeUser && activeUser !== "admin@admin") {
    showSettingForm();
    hi.addEventListener("click", toggleUserPanel);
    hi.textContent = `Hi ${activeUser}~`;
    showForOldUser();
  } else if (activeUser === "admin@admin") {
    console.log("admin at start");
    showAdmin();
  } else {
    signInBtn.addEventListener("click", toggleUserPanel);
    showForNewUser();
  }
}
/////////// form handling ///////////
signInForm.addEventListener("submit", signIn);
function signIn(e) {
  e.preventDefault();
  showSettingForm();
  const email = document.querySelector("#email").value;
  window.sessionStorage.setItem("user", email);
  hi.textContent = `Hi ${email},`;
  if (email === "admin@admin") {
    showAdmin();
  } else if (email !== "") {
    showForOldUser();
  }
}
settingForm.addEventListener("submit", updateSetting);
function updateSetting(e) {
  e.preventDefault();
  console.log("update user setting");
}
cancelBtn.addEventListener("click", cancelMembership);
function cancelMembership(e) {
  e.preventDefault();
  console.log("cancel membership");
}
function signOut() {
  window.sessionStorage.removeItem("user");
  showSignInForm();
  showForNewUser();
  console.log("signed out");
}
function signUp(e) {
  e.preventDefault();
  console.log("sign up new user");
}

/////////// display ///////////
function showSignInForm() {
  userPanel.classList.remove("expand");
  signInForm.classList.remove("hide");
  settingForm.classList.add("hide");
  signInBtn.addEventListener("click", toggleUserPanel);
}
function showSettingForm() {
  userPanel.classList.remove("expand");
  signInForm.classList.add("hide");
  settingForm.classList.remove("hide");
  signOutBtn.addEventListener("click", signOut);
  hi.addEventListener("click", toggleUserPanel);
}
function toggleUserPanel() {
  userPanel.classList.toggle("expand");
}
function showAdmin() {
  showSettingForm(); // to hide the 'signInForm'
  settingForm
    .querySelectorAll(
      "fieldset, div, button:not(.showToAdmin), input, .cancelBtn"
    )
    .forEach(ele => ele.classList.add("hide"));
  hi.textContent = `Hi admin~`;
  adminSection.classList.remove("hide");
  forNewUserSectionS.forEach(fnu => fnu.classList.add("hide"));
  userSection.classList.add("hide");
}
function showForNewUser() {
  adminSection.classList.add("hide");
  forNewUserSectionS.forEach(fnu => fnu.classList.remove("hide"));
  userSection.classList.add("hide");
}
function showForOldUser() {
  adminSection.classList.add("hide");
  forNewUserSectionS.forEach(fnu => fnu.classList.add("hide"));
  userSection.classList.remove("hide");
}
