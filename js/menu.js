"use strict";

/*-------------------------------------------
Show/hide sidemenu
------------------------------------------*/

function hideMenu() {
  const settingBtn = document.querySelector("#settingBtn");
  const newsBtn = document.querySelector("#newsBtn");
  const sidebar = document.querySelector(".sidebar");
  const signedInContainer = document.querySelector(".signedInContainer");

  settingBtn.addEventListener("click", function() {
    console.log("clicked");
    if (sidebar.style.display == "none") {
      sidebar.style.display = "block";
      signedInContainer.classList.remove("closed");
    } else {
      sidebar.style.display = "none";
      signedInContainer.classList.add("closed");
    }
  });

  newsBtn.addEventListener(
    "click",
    function() {
      console.log("clicked");
      if (sidebar.style.display == "none") {
        sidebar.style.display = "block";
        signedInContainer.classList.remove("closed");
      } else {
        sidebar.style.display = "none";
        signedInContainer.classList.add("closed");
      }
    },
    false
  );
}
hideMenu();

function expandInfo() {
  const petImage = document.querySelectorAll("#animalImage img");
  const petExpand = document.querySelector(".petExpand");

  for (let i = 0; i < petImage.length; i++) {
    petImage[i].addEventListener("click", function() {
      console.log("clicked");

      if (petExpand.style.display == "grid") {
        petExpand.style.display = "none";
      } else petExpand.style.display = "grid";
      //petExpand.style.visibility = "visible";
      //petExpand.classList.toggle("expandVisible");
    });
  }
}

/*
petImage.forEach(function() {
  petImage.addEventListener("click", function() {
    console.log("clicked");
  });
});
*/
expandInfo();
