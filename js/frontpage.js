"use strict";

/*-------------------------------------------
Display signin form
------------------------------------------*/

let memberBtn = document.querySelector("#alreadyMemberBtn");
let signinForm = document.querySelector("#loginForm");
memberBtn.addEventListener("click", openSigninForm);

function openSigninForm() {
  signinForm.classList.toggle("visible");
}

/*-------------------------------------------
Open Modal
------------------------------------------*/
/*let inputfield = document.querySelectorAll("input");
let label = document.querySelectorAll("label");

inputfield.forEach(inputfield => {
  if (inputfield.placeholder !== "") {
    console.log("there is something");
  } else {
    console.log("there is nothing");
  }
});
*/
