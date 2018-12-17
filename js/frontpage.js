"use strict";

/*-----------------------------------------
Elements for HTML 
----------------------------------------*/
const animalListOnLoggedIn = document.querySelector("#animalList");
const eachAnimalTemp = document.querySelector("#eachAnimalTemp").content;
const petExpand = document.querySelector("#petExpand");
const adminSection = document.querySelector("#admin");
const userSettingPanel = document.querySelector("#userSettings");
const userSettingForm = userSettingPanel.querySelector("form");
const newsFeedPanel = document.querySelector("#newsFeed");
const prefModal = document.querySelector("#preferencesModal");
const preferenceForm = document.querySelector("#preferencesModal form");
const cancelMembershipBtn = document.querySelector("#cancelMembership");
const detailedAnimalTemp = document.querySelector("#detailedAnimalTemp")
  .content;
const donationTemp = document.querySelector("#memberDonation").content;

/*-------------------------------------------
Initialize Firebase
------------------------------------------*/
let config = {
  apiKey: "AIzaSyBpAvUcRTsrwq5HRkRbruyxmhkhfdLbiMk",
  authDomain: "hoap-exam2018.firebaseapp.com",
  databaseURL: "https://hoap-exam2018.firebaseio.com",
  projectId: "hoap-exam2018",
  storageBucket: "hoap-exam2018.appspot.com",
  messagingSenderId: "287614156735"
};
firebase.initializeApp(config);

// config database in firestore
const db = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
db.settings(settings);

// reference to storage in firebase
let storage = firebase.storage();
let storageReference = storage.ref();

/*-------------------------------------------
Start
------------------------------------------*/

window.addEventListener("DOMContentLoaded", init);

function init() {
  newsFeedPanel.innerHTML = "";

  signinButton.addEventListener("click", signinUser);
  signupBtn.addEventListener("click", signupUser);
  alreadyMemberBtn.addEventListener("click", openSigninForm);

  /*-------------------------------------------
Display right content if user
------------------------------------------*/

  const frontpageContent = document.querySelector("#frontpageContent");
  const signedInContent = document.querySelector("#signedInContent");
  const memberBtns = document.querySelector("#sidebarBtns");
  const signoutAdminBtn = document.querySelector("#signoutAdmin");
  const signOutButton = document.querySelector("#signOut");
  const footer = document.querySelector("#footer");

  // check if a user session already exist, if yes, show content that matches this user
  // use as medium to pass info with page reload, since there's no AuthStateChange, the current code using onAuthStateChanged won't fire with page reload and therefore will lose the current user info which affects the user setting panel and the notifications
  if (window.sessionStorage.getItem("userEmail")) {
    const currentUserEmail = window.sessionStorage.getItem("userEmail");
    getUserSetting(currentUserEmail);
    //    getUserNotifications(currentUserEmail);
  }
  // detect user state change and display different content based on what type of user is logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user && user.email === "admin@admin.com") {
      displayAnimals();
      adminSection.style.display = "block";
      frontpageContent.style.display = "none";
      signedInContent.style.display = "none";
      signinForm.style.display = "none";
      alreadyMemberBtn.style.display = "none";
      memberBtns.style.display = "none";
      signoutAdminBtn.style.display = "block";
      footer.style.display = "none";
      db.collection("toDoList")
        .get()
        .then(showTasks => {
          showTasks.docs.forEach(doc => {
            //renderTask(doc);
          });
        });
    } else if (user) {
      adminSection.style.display = "none";
      frontpageContent.style.display = "none";
      signedInContent.style.display = "block";
      signinForm.style.display = "none";
      alreadyMemberBtn.style.display = "none";
      memberBtns.style.display = "block";
      signoutAdminBtn.style.display = "none";
      //      buildAnimalListOnLoggedinPage();
      getUserAnimals(user.email);
      getUserSetting(user.email);
      getUserNotifications(user.email);
    } else {
      adminSection.style.display = "none";
      frontpageContent.style.display = "block";
      signedInContent.style.display = "none";
      alreadyMemberBtn.style.display = "block";
      memberBtns.style.display = "none";
      signoutAdminBtn.style.display = "none";
      footer.style.display = "grid";
    }
  });

  signoutAdminBtn.addEventListener("click", signout);
  signOutButton.addEventListener("click", signout);

  /*-------------------------------------------
Render tasks from database into website 
--------------------------------------------*/
  let taskList = document.querySelector(".toDoListWrapper");

  function renderTask(doc) {
    let taskDiv = document.createElement("div");
    let task = document.createElement("span");
    let taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";

    taskDiv.setAttribute("data-id", doc.id);
    task.textContent = doc.data().task;

    taskDiv.appendChild(taskCheckbox);
    taskDiv.appendChild(task);
    taskList.appendChild(taskDiv);

    //deleting/completing tasks

    taskCheckbox.addEventListener("click", e => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute("data-id");
      db.collection("toDoList")
        .doc(id)
        .delete();
    });
  }

  /*-------------------------------------------
                Add to do task
------------------------------------------*/

  const toDoBtn = document.querySelector(".addToDoBtn");
  const toDoInput = document.querySelector(".subsectionHeader span input");

  toDoBtn.addEventListener("click", e => {
    console.log("hello");
    e.preventDefault();
    db.collection("toDoList").add({
      task: toDoInput.value,
      writer: "admin",
      type: "To Do"
    });
    toDoInput.value = "";
  });

  /*-------------------------------------------
               live updates
------------------------------------------*/
  db.collection("toDoList").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    //console.log(changes);
    changes.forEach(change => {
      if (change.type == "added") {
        renderTask(change.doc);
      } else if (change.type == "removed") {
        let taskDiv = taskList.querySelector(
          "[data-id='" + change.doc.id + "']"
        );
        taskList.removeChild(taskDiv);
      }
    });
  });
}

/*-------------------------------------------
Post message from admin to notifications panel
------------------------------------------*/

const adminPostBtn = document.querySelector(".postBtn");
const adminPostInput = document.querySelector(".writeNotification");
const notificationForm = document.querySelector("#nofiticationAdmin");
adminPostBtn.addEventListener("click", e => {
  console.log("message posted");
  e.preventDefault();
  db.collection("notifications").add({
    text: adminPostInput.value,
    type: notificationForm.type.value,
    image: ""
  });
  adminPostInput.value = "";
});
/*-------------------------------------------
Display signin form
------------------------------------------*/

let alreadyMemberBtn = document.querySelector("#alreadyMemberBtn");
let signinForm = document.querySelector("#loginForm");

function openSigninForm() {
  if (signinForm.style.display == "block") {
    signinForm.style.display = "none";
  } else {
    signinForm.style.display = "block";
  }
}

/*------------------------------------------
sign in user
------------------------------------------*/

//const for signin
const signinEmail = document.querySelector("#signinEmail");
const signinPassword = document.querySelector("#signinPassword");
const signinButton = document.querySelector("#signinButton");

//sign in a new user

function signinUser(e) {
  e.preventDefault();
  firebase
    .auth()
    .signInWithEmailAndPassword(signinEmail.value, signinPassword.value)
    .then(() => {
      // keep current user in browser session so that the user is kept with page reload
      window.sessionStorage.setItem("userEmail", signinEmail.value);
      const currentUserEmail = window.sessionStorage.getItem("userEmail");
      resetForm(userSettingForm);
      getUserSetting(currentUserEmail);
      // getUserNotifications(currentUserEmail);
      getUserAnimals(currentUserEmail);
    })
    .catch(function(error) {
      console.log(error);
    });
}
/*-------------------------------------------
Sign up user
------------------------------------------*/
const signupName = document.querySelector("#signupName");
const signupPassword = document.querySelector("#signupPassword");
const signupEmail = document.querySelector("#signupEmail");
const signupBtn = document.querySelector("#signupBtn");

function signupUser(e) {
  e.preventDefault();
  resetForm(userSettingForm);
  //go to preferences page
  firebase
    .auth()
    .createUserWithEmailAndPassword(signupEmail.value, signupPassword.value)
    .then(() => {
      // show preference popup and hide other panels
      showElement(prefModal);
      hideElement(userSettingPanel);
      hideElement(newsFeedPanel);
      window.sessionStorage.setItem("userEmail", signupEmail.value);
      const currentUserEmail = window.sessionStorage.getItem("userEmail");
      preferenceSetting(currentUserEmail);
    })
    .catch(function(error) {
      console.log(error);
    });
}

/*-------------------------------------------
Signout user
------------------------------------------*/

function signout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Succesfull logout");
      window.sessionStorage.removeItem("userEmail");
    })
    .catch(function(error) {
      // An error happened.
      console.log(err);
    });
}

/*-------------------------------------------
Upload an image to database
------------------------------------------*/

//get elements
const uploader = document.querySelector("#uploader");
const fileButton = document.querySelector("#fileButton");

//listen for file selection

fileButton.addEventListener("change", function(e) {
  //get file
  let file = e.target.files[0];

  // document.querySelector('input[type="file"]').value.split(/(\\|\/)/g).pop();
  //https://forums.asp.net/t/2027451.aspx?How%20to%20get%20file%20name%20selected%20in%20input%20type%20file%20&fbclid=IwAR1q1NmUJszE3bNt4Pn9tbY068Q9x4A2Ar2sWA39Tep5CUrpY2FdiTh5DA8

  //create a storage ret
  let storageRef = firebase.storage().ref("member/" + file.name);

  //upload file
  let task = storageRef.put(file);

  // update progress bar
  task.on(
    "state_changed",
    function progress(snapshot) {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    function error(err) {},
    function complete() {
      console.log("picture is uploaded");
    }
  );
});

/*--------------------------------------
Get animal list from database to user
-------------------------------------*/

function buildAnimalListOnLoggedinPage() {
  animalListOnLoggedIn.innerHTML = "";
  db.collection("animals")
    .get()
    .then(res => {
      res.docs.forEach(doc => {
        const clone = eachAnimalTemp.cloneNode(true);

        clone.querySelector(".animalName").textContent = doc.data().name;
        clone.querySelector(".eachAnimal").setAttribute("data-id", doc.id);

        if (doc.data().file !== undefined && doc.data().file !== "") {
          let animalImage2 = document.createElement("img");
          let animalImageName = doc.data().file;
          let storage = firebase.storage();
          let storageReference = storage.ref();
          let childRef = storageReference.child(`admin/${animalImageName}`);
          console.log(animalImageName);
          childRef
            .getDownloadURL()
            .then(url => {
              animalImage2.setAttribute("src", url);
              //clone.querySelector(".eachAnimalImage").setAttribute("src", url);
              animalListOnLoggedIn
                .querySelector(".eachAnimal")
                .appendChild(animalImage2);
            })
            .catch(function(error) {
              console.log(error);
            });
        }
        animalListOnLoggedIn.appendChild(clone);
      });
      const allIndividualAnimalS = document.querySelectorAll(".eachAnimal");
      allIndividualAnimalS.forEach(a => {
        a.addEventListener("click", e => {
          const clickedAnimalID = e.target.dataset.id;
          db.collection("animals")
            .doc(clickedAnimalID)
            .get()
            .then(res => {
              petExpand.style.display = "block";
              cloneAnimalInfo(res.data());
              console.log(res.data().name);
            });
        });
      });
    });
}

/*--------------------------------------
Add data to expand & open expands
-------------------------------------*/

function cloneAnimalInfo(data, animalID) {
  petExpand.innerHTML = "";
  const clone = detailedAnimalTemp.cloneNode(true);

  clone.querySelector(".animalName").textContent = data.name;
  clone.querySelector(".animalBreed").textContent = data.breed;
  clone.querySelector(".animalAge").textContent = data.age;
  clone.querySelector(".animalGender").textContent = data.gender;
  clone.querySelector(".animalSize").textContent = data.size;
  if (!data.young) {
    clone.querySelector(".animalPup").style.display = "none";
  }
  if (!data.pregnant) {
    clone.querySelector(".animalPregnant").style.display = "none";
  }
  clone.querySelector(".animalStory").textContent = data.story;
  clone.querySelector(".money").textContent = data.money;
  clone.querySelector(".name").textContent = data.name;
  let donationClone = donationTemp.cloneNode(true);
  donationClone.querySelector("form").setAttribute("data-id", animalID);
  const donationForm = donationClone.querySelector("form");
  donationForm.addEventListener("submit", donate);

  petExpand.appendChild(donationClone);
  petExpand.appendChild(clone);
  const closeExpandBtn = document.querySelector(".closeExpandBtn");
  closeExpandBtn.addEventListener("click", () => {
    petExpand.style.display = "none";
  });
}
function donate(e) {
  e.preventDefault();
  const donationSubmitForm = document.querySelector("#donationFormLogginIn");
  const animalID = donationSubmitForm.dataset.id;
  const moneyAmount = donationSubmitForm.moneyAmount.value;
  //  const date = donationSubmitForm.date.value;
  const userEmail = window.sessionStorage.getItem("userEmail");
  db.collection("moneyDonation")
    .add({
      amount: moneyAmount,
      userEmail: userEmail,
      animalID: animalID
    })
    .then(() => {
      console.log("money donated");
    });
}

/** 
/** 
/** 
/** 
 * From here on the code is cleared and structured 
**/

/*************************************
 * user interaction
 *************************************/
cancelMembershipBtn.addEventListener("click", cancelMembership);

/*--------------------------------------
Open preference modal
-------------------------------------*/
function preferenceSetting(email) {
  // sync donation value text when user adjust range bar
  syncNrWithRange(preferenceForm, preferenceForm.querySelector(".donationNr"));
  // submit form in 2 ways
  const submitPrefBtn = document.querySelector("#submitPrefBtn");
  const skipPrefBtn = document.querySelector("#skipPrefBtn");
  preferenceForm.addEventListener("submit", sendPreferenceToDatabase);
  skipPrefBtn.addEventListener("click", () => {
    sendPreferenceToDatabase();
    hideElement(prefModal);
  });
}

/*************************************
 * functions that write(POST,UPDATE,DELETE) to database
 *************************************/

function sendPreferenceToDatabase(e) {
  if (e) {
    e.preventDefault();
  }
  // get current user email
  let email = window.sessionStorage.getItem("userEmail");
  // get values from preference form
  const nickname = preferenceForm.nickname.value;
  const catBol = preferenceForm.cat.checked ? true : false;
  const dogBol = preferenceForm.dog.checked ? true : false;
  const maleBol = preferenceForm.male.checked ? true : false;
  const femaleBol = preferenceForm.female.checked ? true : false;
  const smallBol = preferenceForm.small.checked ? true : false;
  const mediumBol = preferenceForm.medium.checked ? true : false;
  const largeBol = preferenceForm.large.checked ? true : false;
  const pupBol = preferenceForm.pup.checked ? true : false;
  const pregnantBol = preferenceForm.pregnant.checked ? true : false;
  const errandBol = preferenceForm.errand.checked ? true : false;
  const newcomingBol = preferenceForm.newComming.checked ? true : false;
  const monthlyDonation = preferenceForm.monthlyDonation.value;

  // add user to db with the values
  db.collection("member")
    .add({
      email: email,
      nickname: nickname,
      permission: "none",
      seeCat: catBol,
      seeDog: dogBol,
      seeMale: maleBol,
      seeFemale: femaleBol,
      seeSmall: smallBol,
      seeMedium: mediumBol,
      seeLarge: largeBol,
      seePup: pupBol,
      seePregnant: pregnantBol,
      notifyErrand: errandBol,
      notifyNewcoming: newcomingBol,
      monthlyDonation: monthlyDonation,
      following: []
    })
    .then(() => {
      getUserSetting(email);
      getUserNotifications(email);
      getUserAnimals(email);
    });
  // hide modal without waiting for db success
  hideElement(prefModal);
}

function updatePreferenceToDatabase() {
  console.log("update user preferences");
}

function cancelMembership() {
  var currentUser = firebase.auth().currentUser;
  currentUser
    .delete()
    .then(function() {
      console.log("Thanks for being with us~ Hope we can see you again.");
      signout();
      db.collection("member")
        .where("email", "==", currentUser.email)
        .get()
        .then(res =>
          res.forEach(doc => {
            doc.ref.delete();
          })
        );
    })
    .catch(function(error) {
      console.log(error);
    });
}

/**************************************
 * functions that GET data from database and display them
 *************************************/
function getUserSetting(userEmail) {
  resetForm(preferenceForm);
  // get current setting
  db.collection("member")
    .where("email", "==", userEmail)
    .get()
    .then(res => {
      res.forEach(entry => {
        const data = entry.data();
        userSettingPanel.querySelector(".userName").textContent = data.nickname;
        const updatePrefForm = document.querySelector("#userSettings form");
        // not DRY from this point on, probably no time to change it before hand in
        if (data.seeCat) {
          updatePrefForm.cat.checked = true;
        }
        if (data.seeDog) {
          updatePrefForm.dog.checked = true;
        }
        if (data.seeFemale) {
          updatePrefForm.female.checked = true;
        }
        if (data.seeMale) {
          updatePrefForm.male.checked = true;
        }
        if (data.seeSmall) {
          updatePrefForm.small.checked = true;
        }
        if (data.seeMedium) {
          updatePrefForm.medium.checked = true;
        }
        if (data.seeLarge) {
          updatePrefForm.large.checked = true;
        }
        if (data.seePup) {
          updatePrefForm.pup.checked = true;
        }
        if (data.seePregnang) {
          updatePrefForm.pregnant.checked = true;
        }
        if (data.notifyErrand) {
          updatePrefForm.errand.checked = true;
        }
        if (data.notifyNewcoming) {
          updatePrefForm.newComming.checked = true;
        }
        updatePrefForm.monthlyDonation.value = data.monthlyDonation;
        updatePrefForm.querySelector(".donationNr").textContent =
          data.monthlyDonation;
        document.querySelector(".userName").textContent = data.nickname;
      });
    });
}

function getUserNotifications(userEmail) {
  newsFeedPanel.innerHTML = "";
  // check user preferences regarding notifications
  db.collection("member")
    .where("email", "==", userEmail)
    .get()
    .then(res => {
      res.forEach(entry => {
        if (entry.data().notifyErrand) {
          getErrands();
        }
        if (entry.data().notifyNewcoming) {
          getNewcoming();
        }
        getUrgent();
        getOtherNotification();
      });
    });
}
function getErrands() {
  db.collection("notifications")
    .where("type", "==", "errands")
    .get()
    .then(res => {
      res.forEach(entry => {
        let p = document.createElement("p");
        p.classList.add("errandsNotification");
        p.textContent = entry.data().text;
        newsFeedPanel.appendChild(p);
      });
    });
}
function getNewcoming() {
  db.collection("notifications")
    .where("type", "==", "newComing")
    .get()
    .then(res => {
      res.forEach(entry => {
        let p = document.createElement("p");
        p.classList.add("newComingNotification");
        p.textContent = entry.data().text;
        newsFeedPanel.appendChild(p);
      });
    });
}
function getUrgent() {
  db.collection("notifications")
    .where("type", "==", "urgent")
    .get()
    .then(res => {
      res.forEach(entry => {
        let p = document.createElement("p");
        p.classList.add("urgentNotification");
        p.textContent = entry.data().text;
        newsFeedPanel.appendChild(p);
      });
    });
}
function getOtherNotification() {
  db.collection("notifications")
    .where("type", "==", "other")
    .get()
    .then(res => {
      res.forEach(entry => {
        let p = document.createElement("p");
        p.classList.add("otherNotification");
        p.textContent = entry.data().text;
        newsFeedPanel.appendChild(p);
      });
    });
}

function getUserAnimals(userEmail) {
  // check user preferences regarding notifications
  db.collection("member")
    .where("email", "==", userEmail)
    .get()
    .then(res => {
      res.forEach(entry => {
        if (entry.data().seeCat && entry.data().seeDog === false) {
          showCats(userEmail);
        } else if (entry.data().seeDog && entry.data().seeCat === false) {
          showDogs(userEmail);
        } else {
          showAllAnimal(userEmail);
        }
      });
    });
}
function showCats(userEmail) {
  db.collection("animals")
    .where("type", "==", "cat")
    .get()
    .then(res => {
      appendEachAnimal(res, userEmail);
    });
}
function showDogs(userEmail) {
  db.collection("animals")
    .where("type", "==", "Dog")
    .get()
    .then(res => {
      appendEachAnimal(res, userEmail);
    });
}
function showAllAnimal(userEmail) {
  db.collection("animals")
    .get()
    .then(res => {
      appendEachAnimal(res, userEmail);
    });
}
function appendEachAnimal(array, userEmail) {
  animalListOnLoggedIn.innerHTML = "";
  array.forEach(entry => {
    const data = entry.data();
    let animalDiv = document.createElement("div");
    animalDiv.classList.add("eachAnimal");
    animalDiv.dataset.id = entry.id;
    let animalName = document.createElement("p");
    animalName.textContent = data.name;
    let animalImg = document.createElement("img");
    if (data.file !== undefined && data.file !== "") {
      let fileName = data.file;
      let animalImgRef = storageReference.child(`admin/${fileName}`);
      animalImgRef
        .getDownloadURL()
        .then(function(url) {
          console.log(url);
          animalImg.setAttribute("src", url);
        })
        .catch(function(error) {
          console.log(error);
          animalImg.setAttribute("src", "img/animals/default.png");
        });
    } else {
      animalImg.setAttribute("src", "img/animals/newcomer.png");
    }
    let heart = document.createElement("img");
    heart.classList.add("heart");
    // check if user follows this animal
    db.collection("member")
      .where("email", "==", userEmail)
      .get()
      .then(res => {
        res.forEach(user => {
          if (user.data().following.indexOf(entry.id) > -1) {
            heart.setAttribute("src", "img/icons/filledheart.png");
            heart.setAttribute("alt", "filled heart icon");
          } else {
            heart.setAttribute("src", "img/icons/emptyheart.png");
            heart.setAttribute("alt", "empty heart icon");
          }
        });
      });
    let statusCircle = document.createElement("div");
    statusCircle.classList.add("statusCircle");
    animalDiv.appendChild(animalName);
    animalDiv.appendChild(animalImg);
    animalDiv.appendChild(heart);
    animalDiv.appendChild(statusCircle);
    animalDiv.addEventListener("click", e => {
      showAnimalModal(entry.id);
    });
    animalListOnLoggedIn.appendChild(animalDiv);
  });
}

function showAnimalModal(animalId) {
  db.collection("animals")
    .doc(animalId)
    .get()
    .then(res => {
      petExpand.style.display = "block";
      cloneAnimalInfo(res.data(), animalId);
    });
}

/**************************************
 * general display functions, reusable
 **************************************/

function showElement(ele) {
  ele.style.display = "inherit";
  ele.classList.add("visible");
}

function hideElement(ele) {
  ele.style.display = "none";
  ele.classList.remove("visible");
}

function toggleElememnt(ele) {
  ele.classList.toggle("visible");
}

function resetForm(form) {
  const allFormELements = form.querySelectorAll("*");
  allFormELements.forEach(e => {
    e.value = "";
    if (e.checked) {
      e.checked = false;
    }
  });
}

function syncNrWithRange(form, element) {
  const donationNr = form.querySelector(".donationNr");
  element.textContent = preferenceForm.monthlyDonation.value;
  form.querySelector('input[type="range"').addEventListener("change", e => {
    element.textContent = e.target.value;
  });
}
