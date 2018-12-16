"use strict";

/*-------------------------------------------
Show/hide sidemenu
------------------------------------------*/

function hideMenu() {
  const settingBtn = document.querySelector("#settingBtn");
  const newsBtn = document.querySelector("#newsBtn");
  const signedInContainer = document.querySelector(".signedInContainer");
  const userSettings = document.querySelector("#userSettings");
  const newsFeed = document.querySelector("#newsFeed");

  settingBtn.addEventListener("click", function() {
    newsFeed.classList.remove("visible");
    userSettings.classList.toggle("visible");
  });

  newsBtn.addEventListener("click", function() {
    userSettings.classList.remove("visible");
    newsFeed.classList.toggle("visible");
  });
}
hideMenu();
/*
function expandInfo() {
  const petImage = document.querySelectorAll("#animalImage img");
  const petExpand = document.querySelector("#petExpand");

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

petImage.forEach(function() {
  petImage.addEventListener("click", function() {
    console.log("clicked");
  });
});

expandInfo();
*/
