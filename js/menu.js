/*-------------------------------------------
Show/hide sidemenu
------------------------------------------*/

function hideMenu() {
  const settingBtn = document.querySelector("#settingBtn");
  const sidebar = document.querySelector(".sidebar");
  const signedInContainer = document.querySelector(".signedInContainer");

  settingBtn.addEventListener(
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
