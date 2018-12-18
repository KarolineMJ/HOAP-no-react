"use strict";

/*-------------------------------------------
Show/hide sidemenu
------------------------------------------*/

function toggleSidebar() {
  const settingBtn = document.querySelector("#settingBtn");
  const newsBtn = document.querySelector("#newsBtn");
  const userSettings = document.querySelector("#userSettings");
  const newsFeed = document.querySelector("#newsFeed");

  settingBtn.addEventListener("click", function() {
    newsFeed.classList.remove("visible");
    userSettings.classList.toggle("visible");
  });

  newsBtn.addEventListener("click", function() {
    userSettings.classList.remove("visible");
    newsFeed.classList.toggle("visible");
    // getUserNotifications(currentUserEmail);
  });
}

toggleSidebar();

function toggleMobileSections() {
  const mobileSettingBtn = document.querySelector("#settingSectionMobile");
  const mobileNewsBtn = document.querySelector("#newsSectionMobile");
  const mobileHomeBtn = document.querySelector("#homeSectionMobile");
  const userSettings = document.querySelector("#userSettings");
  const newsFeed = document.querySelector("#newsFeed");
  const homeSection = document.querySelector("#signedInContent");

  mobileSettingBtn.addEventListener("click", function() {
    newsFeed.classList.remove("visible");
    homeSection.classList.remove("visible");
    userSettings.classList.toggle("visible");
  });

  mobileNewsBtn.addEventListener("click", function() {
    userSettings.classList.remove("visible");
    homeSection.classList.remove("visible");
    newsFeed.classList.toggle("visible");
    // getUserNotifications(currentUserEmail);
  });

  mobileHomeBtn.addEventListener("click", function() {
    userSettings.classList.remove("visible");
    newsFeed.classList.remove("visible");
    // getUserNotifications(currentUserEmail);
  });
}
toggleMobileSections();

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
