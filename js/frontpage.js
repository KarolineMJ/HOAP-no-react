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
const oneTimeDonationForm = document.querySelector("#oneTimeDonation");
const subscribeForm = document.querySelector("#subscribeForm form");
const messageForm = document.querySelector("#messageForm form");
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
    getUserDonationSofar(currentUserEmail);
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
      getUserDonationSofar(user.email);
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
    if (doc.data().writer !== "admin") {
      task.textContent = "From " + doc.data().writer + ": ";
      task.classList.add("userMessage");
    }
    task.textContent += doc.data().task;
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
  const toDoInput = document.querySelector(".subsectionToDo input");

  toDoBtn.addEventListener("click", e => {
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
      getUserDonationSofar(currentUserEmail);
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
Add data to expand & open expands
-------------------------------------*/

function cloneAnimalInfo(data, animalID) {
  const src = document
    .querySelector(`.eachAnimal[data-id="${animalID}"] img`)
    .getAttribute("src");
  petExpand.innerHTML = "";
  const clone = detailedAnimalTemp.cloneNode(true);
  clone.querySelector(".bigAnimalImage img").setAttribute("src", src);
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
  // append the donation section of this animal
  let donationClone = donationTemp.cloneNode(true);
  donationClone.querySelector("form").setAttribute("data-id", animalID);
  const donationForm = donationClone.querySelector("form");
  const morning = donationClone.querySelector("label.morning");
  const afternoon = donationClone.querySelector("label.afternoon");
  const evening = donationClone.querySelector("label.evening");
  const training = donationClone.querySelector("label.training");
  // need to read db to get needed time slots
  db.collection("dailyTaskTemplate")
    .where("animalID", "==", animalID)
    .get()
    .then(res => {
      res.forEach(entry => {
        if (entry.data().morning === false) {
          morning.classList.add("crossout");
          morning.querySelector("input").setAttribute("disabled", "disabled");
        }
        if (entry.data().afternoon === false) {
          afternoon.classList.add("crossout");
          afternoon.querySelector("input").setAttribute("disabled", "disabled");
        }
        if (entry.data().evening === false) {
          evening.classList.add("crossout");
          evening.querySelector("input").setAttribute("disabled", "disabled");
        }
        if (entry.data().training === false) {
          training.classList.add("crossout");
          training.querySelector("input").setAttribute("disabled", "disabled");
        }
      });
    });
  donationForm.addEventListener("submit", donate);

  petExpand.appendChild(clone);
  petExpand.appendChild(donationClone);
  const closeExpandBtn = document.querySelector(".closeExpandBtn");

  const triangleUp = document.querySelectorAll(".triangleUp");

  closeExpandBtn.addEventListener("click", () => {
    petExpand.style.display = "none";
    hideArrayElements(triangleUp);
  });
}

function donate(e) {
  e.preventDefault();
  const donationSubmitForm = document.querySelector("#donationFormLogginIn");
  const animalID = donationSubmitForm.dataset.id;
  const moneyAmount = donationSubmitForm.moneyAmount.value;
  const date = donationSubmitForm.date.value;
  const userEmail = window.sessionStorage.getItem("userEmail");

  if (date) {
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];
    const morning = donationSubmitForm.morning.checked;
    const afternoon = donationSubmitForm.afternoon.checked;
    const evening = donationSubmitForm.evening.checked;
    const training = donationSubmitForm.traning.checked;
    if (
      morning === true ||
      afternoon === true ||
      evening === true ||
      training === true
    ) {
      db.collection("dailyTasks")
        .add({
          animalID: animalID,
          morning: morning,
          afternoon: afternoon,
          evening: evening,
          training: training,
          year: year,
          month: month,
          day: day,
          user: userEmail
        })
        .then(console.log("Thank you~"));
    }
    let workingTimes = 0;
    if (morning === true) {
      workingTimes += 1;
    }
    if (afternoon === true) {
      workingTimes += 1;
    }
    if (evening === true) {
      workingTimes += 1;
    }
    if (training === true) {
      workingTimes += 2;
    }
    db.collection("timeDonation")
      .where("userEmail", "==", userEmail)
      .get()
      .then(res => {
        if (res.docs.length < 1) {
          db.collection("timeDonation")
            .add({
              animalID: animalID,
              userEmail: userEmail,
              time: workingTimes
            })
            .then(console.log("time registered"));
        } else {
          db.collection("timeDonation")
            .doc(res.docs[0].id)
            .get()
            .then(user => {
              let sumSofar = user.data().time;
              sumSofar += workingTimes;
              db.collection("timeDonation")
                .doc(res.docs[0].id)
                .update({
                  time: sumSofar
                })
                .then(console.log("time counted up"));
            });
        }
      });
  }
  if (moneyAmount) {
    // check if the user has given donation before, if no, add user and donation data, if yes add the amount to the previous sum amount
    db.collection("moneyDonation")
      .where("userEmail", "==", userEmail)
      .get()
      .then(res => {
        if (res.docs.length === 0) {
          db.collection("moneyDonation")
            .add({
              amount: moneyAmount,
              userEmail: userEmail,
              animalID: animalID
            })
            .then(() => {
              console.log("money donated");
            });
        } else {
          console.log("already donated before, will update sum");
          res.forEach(doc => {
            let sum = Number(doc.data().amount);
            sum += Number(moneyAmount);
            db.collection("moneyDonation")
              .doc(doc.id)
              .update({
                amount: sum
              });
          });
        }
      });
  }
}

/*************************************
 * user interaction
 *************************************/
cancelMembershipBtn.addEventListener("click", cancelMembership);
messageForm.addEventListener("submit", sendMessage);
oneTimeDonationForm.addEventListener("submit", onetimeDonation);
subscribeForm.addEventListener("submit", subscribe);

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
      getUserDonationSofar(email);
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

function sendMessage(e) {
  e.preventDefault();
  const user = window.sessionStorage.getItem("userEmail");
  const message = messageForm.message.value;
  if (message) {
    db.collection("toDoList")
      .add({
        task: message,
        type: "user",
        writer: user
      })
      .then(console.log("message sent"));
  }
}

function onetimeDonation(e) {
  e.preventDefault();
  console.log("one time donation");
  const stuff = oneTimeDonationForm.donateWhat.value;
  const postNr = oneTimeDonationForm.postNr.value;
  const pickup = oneTimeDonationForm.pickup.checked;
  const onetimeMoney = oneTimeDonationForm.onetimeMoney.value;
  const inWhoseName = oneTimeDonationForm.inWhoseName.value;
  // if user choose pick up, then this entry shows up in errands
  if (stuff !== "" && pickup === true && postNr !== "") {
    db.collection("stuffDonation").add({
      stuff: stuff,
      postNr: postNr
    });
    const errandsDesc = `Pick up a ${stuff} from ${postNr}`;
    db.collection("notifications").add({
      text: errandsDesc,
      type: "errands"
    });
  } else if (stuff !== "" && pickup === false) {
    db.collection("stuffDonation").add({
      stuff: stuff
    });
  }
  if (onetimeMoney !== "" && inWhoseName !== "") {
    db.collection("moneyDonation").add({
      amount: onetimeMoney,
      inTheNameOf: inWhoseName
    });
  } else if (onetimeDonation !== "") {
    db.collection("moneyDonation").add({
      amount: onetimeMoney
    });
  }
}

function subscribe(e) {
  e.preventDefault();
  const email = subscribeForm.subEmail.value;
  db.collection("subscriptionEmails")
    .add({
      email: email
    })
    .then(console.log("successfully subscribed"));
}

// donate stuff on logged in page
const stuffDonationForm = document.querySelector("#stuffDonationForm form");
stuffDonationForm.addEventListener("submit", stuffDonate);
function stuffDonate(e) {
  e.preventDefault();
  const userEmail = window.sessionStorage.getItem("userEmail");
  const stuff = stuffDonationForm.donateWhatLoggedIn.value;
  const pickup = stuffDonationForm.pickupLoggedIn.checked ? true : false;
  db.collection("stuffDonation")
    .add({
      userEmail: userEmail,
      stuff: stuff,
      pickup: pickup
    })
    .then(console.log("stuff donated"));
  if (pickup === true) {
    const errandsDesc = `Pick up a ${stuff} from ${userEmail}`;
    db.collection("notifications")
      .add({
        text: errandsDesc,
        type: "errands"
      })
      .then(
        console.log("your donation will be picked up by one of our members")
      );
  }
}

/**************************************
 * functions that GET data from database and display them
 *************************************/
function getUserDonationSofar(userEmail) {
  db.collection("timeDonation")
    .where("userEmail", "==", userEmail)
    .get()
    .then(res => {
      res.forEach(doc => {
        const timeSoFar = doc.data().time;
        if (timeSoFar === "1") {
          document.querySelector(".timeSofar").textContent =
            timeSoFar + " hour";
        } else {
          document.querySelector(".timeSofar").textContent =
            timeSoFar + " hours";
        }
      });
    });
  db.collection("moneyDonation")
    .where("userEmail", "==", userEmail)
    .get()
    .then(res => {
      res.forEach(doc => {
        const moneySoFar = doc.data().amount;
        document.querySelector(".moneySofar").textContent = moneySoFar + " kr.";
      });
    });
  db.collection("stuffDonation")
    .where("userEmail", "==", userEmail)
    .get()
    .then(res => {
      let piece = 0;
      res.forEach(doc => {
        piece += 1;
      });
      if (piece === 1) {
        document.querySelector(".stuffSofar").textContent = piece + " piece";
      } else {
        document.querySelector(".stuffSofar").textContent = piece + " pieces";
      }
    });
}

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
    let animalArrow = document.createElement("div");
    animalArrow.classList.add("triangleUp");
    let animalImg = document.createElement("img");
    animalImg.setAttribute("src", entry.data().file);
    // due to Firebase storage quota limit, we decided to not to use images stored in Firebase
    ////////////////////////////////////////////////////////////
    // if (data.file !== undefined && data.file !== "") {
    //   let fileName = data.file;
    //   let animalImgRef = storageReference.child(`admin/${fileName}`);
    //   animalImgRef
    //     .getDownloadURL()
    //     .then(function(url) {
    //       console.log(url);
    //       animalImg.setAttribute("src", url);
    //     })
    //     .catch(function(error) {
    //       console.log("DB error: " + error);
    //       animalImg.setAttribute("src", "img/animals/default.png");
    //     });
    // } else {
    //   animalImg.setAttribute("src", "img/animals/newcomer.png");
    // }
    ////////////////////////////////////////////////////////////
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
    animalDiv.appendChild(animalArrow);
    animalDiv.addEventListener("click", e => {
      let arrows = e.target.parentElement.querySelectorAll(".triangleUp");
      hideArrayElements(arrows);
      e.target.querySelector(".triangleUp").style.display = "inherit";

      showAnimalModal(entry.id);
    });
    animalListOnLoggedIn.appendChild(animalDiv);
  });
  moveAnimals();
}

function showAnimalModal(animalId) {
  db.collection("animals")
    .doc(animalId)
    .get()
    .then(res => {
      petExpand.style.display = "grid";
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

function hideArrayElements(array) {
  array.forEach(removeElement => {
    removeElement.style.display = "none";
  });
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

/*--------------------------------------
Intersection observer on the admin sidebar menu
-------------------------------------*/

//get sections from the DOM
const dailyTasksSection = document.querySelector(".animalTasks");
const dailyTasksAnchor = document.querySelector("aside ul li:nth-child(1) a");
const postAndNotifySection = document.querySelector(".postBtn");
const postAndNotifyAnchor = document.querySelector(
  "aside ul li:nth-child(2) a"
);
const statusSection = document.querySelector(".listOfDonations");
const statusAnchor = document.querySelector("aside ul li:nth-child(3) a");

//Observe daily tasks section
let observerDailyTasks = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      dailyTasksAnchor.classList.add("activeAnchor");
      //postAndNotifyAnchor.classList.remove("activeAnchor");
    } else {
      dailyTasksAnchor.classList.remove("activeAnchor");
    }
  });
});

observerDailyTasks.observe(dailyTasksSection);

//Observe post and notify section
let postAndNotifyobserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      postAndNotifyAnchor.classList.add("activeAnchor");
      //dailyTasksAnchor.classList.remove("activeAnchor");
      //statusAnchor.classList.remove("activeAnchor");
    } else {
      postAndNotifyAnchor.classList.remove("activeAnchor");
    }
  });
});

postAndNotifyobserver.observe(postAndNotifySection);

//Observe status section
let statusObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      statusAnchor.classList.add("activeAnchor");
      //postAndNotifyAnchor.classList.remove("activeAnchor");
    } else {
      statusAnchor.classList.remove("activeAnchor");
    }
  });
});

statusObserver.observe(statusSection);

//Click to see more animals
let changeTimes = 0;

function moveAnimals() {
  const leftKey = document.querySelector("#animalArrowLeft");
  const rightKey = document.querySelector("#animalArrowRight");

  const moveAnimalList = document.querySelector("#animalList");

  //const boundRect = moveAnimalList.getBoundingClientRect().width;

  //console.log(boundRect);

  //circular buffer
  leftKey.addEventListener("click", () => {
    const last = document.querySelector("#animalList").lastElementChild;
    const first = document.querySelector("#animalList").firstElementChild;

    last.remove();

    document.querySelector("#animalList").insertBefore(last, first);

    //  changeTimes += 1;
    //  moveAnimalList.style.left = 174 * changeTimes + "px";
  });

  rightKey.addEventListener("click", () => {
    // find first element in animalList
    const first = document.querySelector("#animalList").firstElementChild;

    //removeit
    first.remove();

    //insert as lastelement
    document.querySelector("#animalList").appendChild(first);

    //changeTimes -= 1;
    //moveAnimalList.style.left = 174 * changeTimes + "px";
  });
}
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
