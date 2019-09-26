// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

window.addEventListener("DOMContentLoaded", getListItems);

// API
API = { get, post, patch, destroy };

function get(url) {
	return fetch(url).then(response => response.json());
}

function post(url, data) {
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	}).then(response => response.json());
}

function patch(url, id, data) {
	return fetch(`${url}/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	}).then(response => response.json());
}

function destroy(url, id) {
	return fetch(`${url}/${id}`, {
		method: "DELETE",
	}).then(response => response.json());
}

// CONSTANTS
const BASE_URL = "http://localhost:3000//api/v1/calorie_entries";
const caloriesList = document.querySelector("#calories-list");
const progressBar = document.querySelector("progress");
const addCalorieForm = document.querySelector("form#new-calorie-form");
const modal = document.querySelector("#edit-form-container");
const editForm = modal.querySelector("form");
const bmrForm = document.querySelector("#bmr-calulator");

// FUNCTIONS
function getListItems() {
	API.get(BASE_URL).then(renderListItems);
}

function renderListItems(itemsList) {
	itemsList.forEach(createItem);
}

function createItem(itemData) {
	let listItem = document.createElement("li");
	listItem.className = "calories-list-item";

	let gridDiv = document.createElement("div");
	gridDiv.className = "uk-grid";

	let widthDiv16 = document.createElement("div");
	widthDiv16.className = "uk-width-1-6";

	let strong = document.createElement("strong");
	strong.innerText = itemData.calorie;

	let kcalSpan = document.createElement("span");
	kcalSpan.innerText = " kcal";

	widthDiv16.append(strong, kcalSpan);

	let widthDiv45 = document.createElement("div");
	widthDiv45.className = "uk-width-4-5";

	let em = document.createElement("em");
	em.className = "uk-text-meta";
	em.innerText = itemData.note;

	widthDiv45.appendChild(em);
	gridDiv.append(widthDiv16, widthDiv45);

	let menuDiv = document.createElement("div");
	menuDiv.className = "list-item-menu";

	let editButton = document.createElement("a");
	editButton.className = "edit-button";
	editButton.setAttribute("uk-icon", "icon: pencil");
	editButton.setAttribute("uk-toggle", "target: #edit-form-container");

	let deleteButton = document.createElement("a");
	deleteButton.className = "delete-button";
	deleteButton.setAttribute("uk-icon", "icon: trash");
	deleteButton.addEventListener("click", event => removeListItem(itemData));

	menuDiv.append(editButton, deleteButton);
	listItem.append(gridDiv, menuDiv);
	caloriesList.appendChild(listItem);
	editButton.addEventListener("click", event => prepopulateEditForm(itemData));

	updateProgressBar();
}

function updateProgressBar() {
	let itemsArray = Array.from(caloriesList.children);
	let caloriesArray = itemsArray.map(item =>
		parseInt(item.querySelector("strong").innerText),
	);
	let value = caloriesArray.reduce((acc, curr) => acc + curr);
	progressBar.setAttribute("value", value);
}

function removeListItem(item) {
	API.destroy(BASE_URL, item.id)
		.then(event.target.parentNode.parentNode.parentNode.remove())
		.then(updateProgressBar);
}

function handleAddCalorieSubmission() {
	event.preventDefault();
	let values = {
		api_v1_calorie_entry: {
			calorie: event.target.querySelector("input").value,
			note: event.target.querySelector("textarea").value,
		},
	};
	API.post(BASE_URL, values)
		.then(response => createItem(response))
		.then(emptyAddCalorieForm);
}

function emptyAddCalorieForm() {
	addCalorieForm.querySelector("input").value = "";
	addCalorieForm.querySelector("textarea").value = "";
}

function prepopulateEditForm(item) {
	let trigger = event;
	modal.querySelector("input").value = item.calorie;
	modal.querySelector("textarea").value = item.note;
	editForm.addEventListener("submit", event => handleItemUpdate(trigger, item));
}

function handleItemUpdate(location, item) {
	event.preventDefault();
	let values = {
		api_v1_calorie_entry: {
			calorie: event.target.querySelector("input").value,
			note: event.target.querySelector("textarea").value,
		},
	};
	API.patch(BASE_URL, item.id, values)
		.then(response =>
			updateItem(location.target.parentNode.parentNode.parentNode, response),
		)
		.then(modal.setAttribute("style", ""))
		.then(updateProgressBar);
}

function updateItem(location, item) {
	location.querySelector("strong").innerText = item.calorie;
	location.querySelector("em").innerText = item.note;
}

function handleBMRSubmission() {
	event.preventDefault();
	let weight = event.target.children[1].querySelector("input").value;
	let height = event.target.children[2].querySelector("input").value;
	let age = event.target.children[3].querySelector("input").value;

	let minBMR = parseInt(655 + 4.35 * weight + 4.7 * height - 4.7 * age);
	let maxBMR = parseInt(66 + 6.23 * weight + 12.7 * height - 6.8 * age);

	document.querySelector("#lower-bmr-range").innerText = minBMR;
	document.querySelector("#higher-bmr-range").innerText = maxBMR;

	progressBar.setAttribute("max", (minBMR + maxBMR) / 2);
}

// EVENT LISTENERS
addCalorieForm.addEventListener("submit", handleAddCalorieSubmission);
bmrForm.addEventListener("submit", handleBMRSubmission);
