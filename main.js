// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

//api
const API = { get, post, destroy, patch  };

function get(url) {
  return fetch(url).then(resp => resp.json());
}


function post(url, data) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(resp => resp.json());
  }

  function patch(url, id, data) {
    return fetch(`${url}${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(resp => resp.json());
  }


function destroy(url, id) {
  return fetch(`${url}${id}`, {
    method: "DELETE"
  }).then(console.log);
}

//contants
baseURL = "http://localhost:3000/api/v1/calorie_entries/";
caloriesLi = document.querySelector("#calories-list");
bmrForm = document.querySelector('#bmr-calculator')
heightInput = document.querySelector('#height-input')
weightInput = document.querySelector('#weight-input')
ageInput = document.querySelector('#age-input')
spanLowerBMR = document.querySelector('#lower-bmr-range')
spanHigherBMR = document.querySelector('#higher-bmr-range')
newEntryForm = document.querySelector('#new-calorie-form')
calorieInput = document.querySelector('#calorie-number')
noteInput = document.querySelector('#calorie-note')

//edit entry form 
let editForm = document.querySelector('#edit-calorie-form')
let editNum = document.querySelector('#edit-number')
let editNote = document.querySelector('#edit-note')




//functions

document.addEventListener("DOMContentLoaded", getEntries);

function getEntries() {
  API.get(baseURL).then(entriesList => entriesList.forEach(renderCalories)).then(renderProgressBar);
}

let caloriesIntake = [];
// calorites, notes
function renderCalories(entry) {
  li = document.createElement("li");
  li.className = "calories-list-item";
  li.id = `entry-${entry.id}`;
  div = document.createElement("div");
  div.className = "uk-grid";
  divTwo = document.createElement("div");
  divTwo.className = "uk-width-1-6";
  calories = document.createElement("strong");
  calories.id = `calories-${entry.id}`;
  calories.innerText = entry.calorie;
  caloriesIntake.push(entry.calorie);
  span = document.createElement("span");
  span.innerText = "kcal";
  divTwo.append(calories, span);
  divThree = document.createElement("div");
  divThree.className = "uk-width-4-5";
  note = document.createElement("em");
  note.id = `note-${entry.id}`;
  note.innerText = entry.note;
  divThree.append(note);
  div.append(divTwo, divThree);
  divMenu = document.createElement("div");
  divMenu.className = "list-item-menu";
  editBtn = document.createElement("a");
  editBtn.className = "edit-button";
  editBtn.id = `${entry.id}`;
  editBtn.addEventListener("click", () => openEditForm(entry))
  editBtn.setAttribute("uk-toggle", "target: #edit-form-container");
  editBtn.setAttribute("uk-icon", "icon: pencil");
  deleteBtn = document.createElement("a");
  deleteBtn.id = `${entry.id}`;
  deleteBtn.className = "delete-button";
  deleteBtn.setAttribute("uk-icon", "icon: trash");
  deleteBtn.addEventListener("click", () => deleteEntry(entry.id))
  divMenu.append(editBtn, deleteBtn);
  li.append(div, divMenu);
  caloriesLi.prepend(li);
}

//Create Entry 


function createNewEntry(){
    let calorie = calorieInput.value 
    let note = noteInput.value
    let data = ({api_v1_calorie_entry: {calorie, note}})
    API.post(baseURL, data).then(console.log)
    // (event => renderCalories(event)
}

// EDIT

function openEditForm(entry){
    editNum.value = entry.calorie
    editNote.value = entry.note
    editForm.addEventListener("submit", () => editEntry(entry))
}

function editEntry(entry){
    let calorie = editNum.value 
    let note = editNote.value
    let data = {api_v1_calorie_entry: {calorie, note}}
    debugger
    API.patch(baseURL, entry.id, data).then(console.log)
}
// entry => renderCalories(entry)




// Delete Entry 

function deleteEntry(id){
    API.destroy(baseURL, id).then(entry => removeEntry(entry.id))
}

function removeEntry(id){
    entry = document.querySelector(`#entry-${id}`)
    entry.remove()
}

//PRogress Bar

function renderProgressBar() {
  bar = document.querySelector("progress");
  sumCalories= caloriesIntake.reduce((a, b) => a + b, 0)
  bar.value = sumCalories;
  }

// BMR

bmrForm.addEventListener("submit", handldBmrFormClick)

function handldBmrFormClick(){
    event.preventDefault(); 
    age = ageInput.value
    weight = weightInput.value
    height = heightInput.value 
    lowBMR = Math.ceil(55 + (4.35 * weight) + (4.7 * height) - (4.7 * age))
    highBMR = Math.ceil(66 + (6.23 * weight) + (12.7 * height) - (6.8 * age))
    spanLowerBMR.innerText = lowBMR
    spanHigherBMR.innerText = highBMR
    bar.max = highBMR
}
