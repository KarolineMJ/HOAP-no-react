"use strict";

// html elements
const addAnimalBtn = document.querySelector(".addAnimalBtn");
const addAnimalToDbBtn = document.querySelector(".addAnimalToDB");
const addToDoBtn = document.querySelector(".addToDoBtn");
const signoutForm = document.querySelector(".signOutForm");
const addAnimalPanel = document.querySelector(".addAnimalForm");
const addAnimalForm = document.querySelector(".addAnimalForm form");
const closeX = document.querySelectorAll(".close");
const closeModalBtn = document.querySelector(".buttons .closeModal");
const editAnimalBtn = document.querySelector(".editAnimal");
const deleteAnimalBtn = document.querySelector(".deleteAnimal");
const animalDetailModal = document.querySelector(".animalDetailModal");
const animalDetailForm = document.querySelector(".animalDetails");
const date = document.querySelector(".date");
const uploadBtnAdmin = document.querySelector("#uploadBtnAdmin");
const donorName = document.querySelector("#memberName");
const moneyDonation = document.querySelector("#moneyDonation");
const timeDonation = document.querySelector("#timeDonation");
const stuffDonation = document.querySelector("#stuffDonated");
const membersTamplate = document.querySelector(".membersTemplate").content;

// date related
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const timestamp = today.getTime();
date.textContent = `${year}-${month}-${day}`;

// custom variables
let filename;
let file;
// displayed animal array, use this for update animal list without re-render the whole list AND without using firebases's built-in onchange function
let animalArray = [];

//window.addEventListener("DOMContentLoaded", displayAnimals);

// GET animals from db and generate animal columns
function displayAnimals() {
  const displayedAnimal = document.querySelectorAll(".columns .column");
  displayedAnimal.forEach(a => {
    animalArray.push(a.dataset.id);
  });
  db.collection("animals")
    .orderBy("timestamp")
    .get()
    .then(res => {
      res.docs.forEach(doc => {
        if (animalArray.indexOf(doc.id) < 0) {
          // only add animal column when it's not already displayed
          buildAnimalColumn(doc);
        }
      });
    });
}

// build column of each animal
function buildAnimalColumn(entry) {
  const animalName = entry.data().name;
  const animalID = entry.id;
  //  const animalImageFile = entry.data().image[0];
  const columns = document.querySelector(".tableWrapper .columns");
  let column = document.createElement("div");
  column.dataset.id = entry.id;
  column.classList.add("column");
  let animalImageDiv = document.createElement("div");
  animalImageDiv.classList.add("animalImage");
  let animalImage = document.createElement("img");
  if (entry.data().file !== undefined && entry.data().file !== "") {
    let animalImageName = entry.data().file;
    let storage = firebase.storage();
    let storageReference = storage.ref();
    let childRef = storageReference.child(`admin/${animalImageName}`);
    console.log(animalImageName);
    childRef
      .getDownloadURL()
      .then(function(url) {
        animalImage.src = url;
      })
      .catch(function(error) {
        console.log(error);
        animalImage.src = "img/animals/default.png";
      });
  } else {
    animalImage.src = "img/animals/newcomer.png";
  }
  animalImage.setAttribute("title", animalName);
  animalImageDiv.appendChild(animalImage);
  column.appendChild(animalImageDiv);
  // get daily task of this animal from another collection in database
  db.collection("dailyTasks")
    .where("animalID", "==", animalID)
    // .where("month", "==", month)
    // .where("day", "==", day)
    .get()
    .then(res => {
      res.docs.forEach(doc => {
        if (!doc.data().month && !doc.data().year && !doc.data().day) {
          console.log(doc.data());
          ///////////////////// need to DRY these
          //        if (doc.data().month === month && doc.data().day === day) {
          if (doc.data().morning === false) {
            let row = document.createElement("div");
            row.classList.add("row");
            let noTaskImage = document.createElement("img");
            noTaskImage.setAttribute("src", "img/notask.png");
            row.appendChild(noTaskImage);
            column.appendChild(row);
            columns.appendChild(column);
          } else {
            let row = document.createElement("div");
            row.classList.add("row");
            let taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            let byWhom = document.createElement("span");
            byWhom.classList.add("memberName");
            if (doc.data().morningMember !== "") {
              byWhom.textContent = doc.data().morningMember;
            }
            row.appendChild(taskCheckbox);
            row.appendChild(byWhom);
            column.appendChild(row);
            columns.appendChild(column);
          }
          ////////////////////////////////

          if (doc.data().afternoon === false) {
            let row = document.createElement("div");
            row.classList.add("row");
            let noTaskImage = document.createElement("img");
            noTaskImage.setAttribute("src", "img/notask.png");
            row.appendChild(noTaskImage);
            column.appendChild(row);
            columns.appendChild(column);
          } else {
            let row = document.createElement("div");
            row.classList.add("row");
            let taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            let byWhom = document.createElement("span");
            byWhom.classList.add("memberName");
            if (doc.data().morningMember !== "") {
              byWhom.textContent = doc.data().afternoonMember;
            }
            row.appendChild(taskCheckbox);
            row.appendChild(byWhom);
            column.appendChild(row);
            columns.appendChild(column);
          }

          /////////////////////////////
          if (doc.data().evening === false) {
            let row = document.createElement("div");
            row.classList.add("row");
            let noTaskImage = document.createElement("img");
            noTaskImage.setAttribute("src", "img/notask.png");
            row.appendChild(noTaskImage);
            column.appendChild(row);
            columns.appendChild(column);
          } else {
            let row = document.createElement("div");
            row.classList.add("row");
            let taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            let byWhom = document.createElement("span");
            byWhom.classList.add("memberName");
            if (doc.data().morningMember !== "") {
              byWhom.textContent = doc.data().eveningMember;
            }
            row.appendChild(taskCheckbox);
            row.appendChild(byWhom);
            column.appendChild(row);
            columns.appendChild(column);
          }
          /////////////////////////////
          if (doc.data().training === false) {
            let row = document.createElement("div");
            row.classList.add("row");
            let noTaskImage = document.createElement("img");
            noTaskImage.setAttribute("src", "img/notask.png");
            row.appendChild(noTaskImage);
            column.appendChild(row);
            columns.appendChild(column);
          } else {
            let row = document.createElement("div");
            row.classList.add("row");
            let taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            let byWhom = document.createElement("span");
            byWhom.classList.add("memberName");
            if (doc.data().morningMember !== "") {
              byWhom.textContent = doc.data().trainingMember;
            }
            row.appendChild(taskCheckbox);
            row.appendChild(byWhom);
            column.appendChild(row);
            columns.appendChild(column);
          }
          /////////////////////////////
          if (doc.data().extra === "") {
            let row = document.createElement("div");
            row.classList.add("row");
            let noTaskImage = document.createElement("img");
            noTaskImage.setAttribute("src", "img/notask.png");
            row.appendChild(noTaskImage);
            column.appendChild(row);
            columns.appendChild(column);
          } else {
            let row = document.createElement("div");
            row.classList.add("row");
            let extraDesc = document.createElement("p");
            extraDesc.textContent = doc.data().extra;
            let taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            let byWhom = document.createElement("span");
            byWhom.classList.add("memberName");
            if (doc.data().extraMember !== "") {
              byWhom.textContent = doc.data().extraMember;
            }
            row.appendChild(extraDesc);
            row.appendChild(taskCheckbox);
            row.appendChild(byWhom);
            column.appendChild(row);
            columns.appendChild(column);
          }
        }
      });
    });
  // add listener to newly built column
  column.querySelector(".animalImage").addEventListener("click", e => {
    const clickedID = e.target.parentElement.dataset.id;
    getAnimalInfo(clickedID);
    if (animalDetailModal.classList.contains("hide")) {
      animalDetailModal.classList.remove("hide");
    }
  });
  columns.appendChild(column);
}

// show add animal panel
addAnimalBtn.addEventListener("click", showAddAnimalForm);
function showAddAnimalForm() {
  addAnimalPanel.classList.toggle("hide");
}
// addToDoBtn.addEventListener("click", addToDo);
// function addToDo() {
//   console.log("add a to do to the list");
// }

// get image file
uploadBtnAdmin.addEventListener("change", getFilename);
function getFilename(evt) {
  filename = evt.target.value.split(/(\\|\/)/g).pop();
  file = evt.target.files[0];
  console.log(filename);
}

// add animal to db, including image file
addAnimalForm.addEventListener("submit", e => {
  e.preventDefault();

  //add to the specific collection in firestore
  db.collection("animals")
    .add({
      timestamp: timestamp,
      name: addAnimalForm.animalName.value,
      type: addAnimalForm.type.value,
      breed: addAnimalForm.breed.value,
      age: addAnimalForm.age.value,
      gender: addAnimalForm.gender.value,
      size: addAnimalForm.size.value,
      young: addAnimalForm.young.checked ? true : false,
      pregnant: addAnimalForm.pregnant.checked ? true : false,
      money: addAnimalForm.money.value,
      story: addAnimalForm.story.value,
      file: filename
    })
    .then(docRef => {
      const newlyAddedAnimalID = docRef.id;
      db.collection("dailyTasks").add({
        animalID: newlyAddedAnimalID,
        year: year,
        month: month,
        day: day,
        morning: addAnimalForm.morning.checked ? true : false,
        afternoon: addAnimalForm.afternoon.checked ? true : false,
        evening: addAnimalForm.evening.checked ? true : false,
        training: addAnimalForm.training.checked ? true : false,
        extra: addAnimalForm.extra.value
      });
      resetForm(addAnimalForm);
      // re run displayAnimals to update columns
      displayAnimals();
      // upload file to the firebase storage
      let storageRef = firebase.storage().ref("admin/" + filename);
      //upload file
      let task = storageRef.put(file);
    });
});
// get animal info and display in animal detail modal
function getAnimalInfo(id) {
  db.collection("animals")
    .doc(id)
    .get()
    .then(res => {
      showAnimalDetail(res.data(), id, animalDetailModal, true);
    });
}

// edit animal detail
editAnimalBtn.addEventListener("click", e => {
  e.stopPropagation();
  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  db.collection("animals")
    .doc(id)
    .update({
      name: animalDetailForm.name.value,
      breed: animalDetailForm.breed.value,
      age: animalDetailForm.age.value,
      story: animalDetailForm.story.value,
      gender: animalDetailForm.gender.value,
      size: animalDetailForm.size.value,
      money: animalDetailForm.money.value,
      young: animalDetailForm.young.checked ? true : false,
      pregnant: animalDetailForm.pregnant.checked ? true : false
    });
  // update dailytasks db
  db.collection("dailyTasks")
    .where("animalID", "==", id)
    .get()
    .then(res => {
      res.forEach(doc => {
        const docID = doc.id;
        db.collection("dailyTasks")
          .doc(docID)
          .update({
            morning: animalDetailForm.morning.checked ? true : false,
            afternoon: animalDetailForm.afternoon.checked ? true : false,
            evening: animalDetailForm.evening.checked ? true : false,
            training: animalDetailForm.training.checked ? true : false,
            extra: animalDetailForm.extra.value
          });
      });
    });
  // delete currently displayed column and add a new column with updated info
  document.querySelector(`.column[data-id='${id}']`).remove();
  db.collection("animals")
    .doc(id)
    .get()
    .then(updatedInfo => {
      buildAnimalColumn(updatedInfo);
    });
  closeModal();
});

// delete animal
deleteAnimalBtn.addEventListener("click", e => {
  e.stopPropagation();
  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  db.collection("animals")
    .doc(id)
    .delete();
  closeModal();
  document.querySelector(`.column[data-id='${id}']`).remove();
});

/********************
 * shared functions
 ********************/

// reset form, moved to frontpage.js
// function resetForm(form) {
//   const allFormELements = form.querySelectorAll("*");
//   allFormELements.forEach(e => {
//     e.value = "";
//     if (e.checked) {
//       e.checked = false;
//     }
//   });
// }

// display animal details
function showAnimalDetail(data, id, elem, editableBol) {
  const currentAnimal = id;
  elem.dataset.id = id;
  // clear previous values
  const previousKeys = [
    "male",
    "female",
    "morning",
    "afternoon",
    "evening",
    "training"
  ];
  previousKeys.forEach(key => {
    elem.querySelector(`input[value='${key}']`).removeAttribute("checked");
  });
  if (editableBol === true) {
  }
  // display newly fetched values
  elem.querySelector(".animalName").value = data.name;
  elem.querySelector(".breed").value = data.breed;
  elem.querySelector(".age").value = data.age;
  elem.querySelector(".money").value = data.money;
  if (data.young) {
    elem
      .querySelector(`input[name='young']`)
      .setAttribute("checked", "checked");
  }
  if (data.pregnant) {
    elem
      .querySelector(`input[name='pregnant']`)
      .setAttribute("checked", "checked");
  }
  elem
    .querySelector(`input[value='${data.gender}']`)
    .setAttribute("checked", "checked");
  elem
    .querySelector(`input[value='${data.size}']`)
    .setAttribute("checked", "checked");
  elem.querySelector(".story-textarea").value = data.story;
  db.collection("dailyTasks")
    .where("animalID", "==", id)
    .get()
    .then(res => {
      res.docs.forEach(doc => {
        if (doc.data().morning) {
          elem
            .querySelector(`input[value='morning']`)
            .setAttribute("checked", "checked");
        }
        if (doc.data().afternoon) {
          elem
            .querySelector(`input[value='afternoon']`)
            .setAttribute("checked", "checked");
        }
        if (doc.data().evening) {
          elem
            .querySelector(`input[value='evening']`)
            .setAttribute("checked", "checked");
        }
        if (doc.data().traning) {
          elem
            .querySelector(`input[value='training']`)
            .setAttribute("checked", "checked");
        }
        elem.querySelector(".extra").value = doc.data().extra;
      });
    });
}

// close panal with click on X
closeX.forEach(closePanel);
function closePanel(x) {
  x.addEventListener("click", e => {
    e.target.parentElement.classList.add("hide");
  });
}

// close modal with button click
closeModalBtn.addEventListener("click", () => {
  closeModal();
});

// click animal detail modal
function closeModal() {
  animalDetailModal.classList.add("hide");
}

// GET members details from db and generate the table of members

db.collection("member")
  .get()
  .then(res => {
    res.forEach(doc => {
      const userEmail = doc.data().email;
      if (userEmail !== "admin@admin.com") {
        let clone = membersTamplate.cloneNode(true);
        let sum = 0;
        db.collection("moneyDonation")
          .where("userEmail", "==", userEmail)
          .get()
          .then(res => {
            res.forEach(doc => {
              console.log(userEmail + "donated" + doc.data().amount);
              sum += Number(doc.data().amount);
              // time += Number(doc.data().)
            });
            clone.querySelector("#memberName").textContent = userEmail;
            clone.querySelector("#moneyDonation").textContent = sum;

            document
              .querySelector(".donationsTableContainer")
              .appendChild(clone);
          });
      }
    });
  });

// show image in 3x3 section
const imageContainer = document.querySelector(".receviedPictures");
const singlePicTemp = document.querySelector("#singlePicTemp").content;
db.collection("imagesFromAdmin")
  .get()
  .then(res => {
    res.forEach(doc => {
      if (doc.data().published === false) {
        let clone = singlePicTemp.cloneNode(true);
        let singlePicDiv = clone.querySelector(".singlePic");
        singlePicDiv.style.backgroundImage = "url('img/animals/broder.jpg')";
        singlePicDiv.setAttribute("data-file", "url('img/animals/broder.jpg')");
        imageContainer.appendChild(clone);
      }
    });
    db.collection("imagesFromMember")
      .get()
      .then(res => {
        res.forEach(doc => {
          if (doc.data().published === false) {
            let clone = singlePicTemp.cloneNode(true);
            let singlePicDiv = clone.querySelector(".singlePic");
            singlePicDiv.style.backgroundImage =
              "url('img/animals/broder.jpg')";
            imageContainer.appendChild(clone);
          }
        });
        // publish checked image (only update db, no fetching of these images on the frontpage yet)
        const publishBtn = document.querySelector(".publishBtn");
        let fileArray = [];
        publishBtn.addEventListener("click", publishImg);
        function publishImg() {
          const needToPublish = document.querySelectorAll(".singlePic");
          needToPublish.forEach(eachImage => {
            const checkbox = eachImage.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
              const needToPublishFile = eachImage.dataset.file;
              fileArray.push(needToPublishFile);
            }
          });
          console.log(fileArray);
          // POST files to db
          fileArray.forEach(eachfile => {
            db.collection("frontpageImages")
              .add({
                filename: eachfile
              })
              .then(console.log("added to db, will be published online soon"));
          });
          // clear fileArray after publish
          resetForm(imageContainer);
        }
      });
  });
