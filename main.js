// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

// ---- API functions ---- //
const baseURL = "http://localhost:3000/api/v1/calorie_entries/"
const API = {get, post, patch, destroy}

// function get(url){
//     return fetch(url).then(response => response.json())
// }

function get(url) {
    return fetch(url).then(response => response.json());
}

// function post(url, data){
//     const configObj = {
//         method: "POST",
//         headers: {
//             "Content-Type": 'application/json'
//         },
//         body: JSON.stringify(data)
//     }
//     return fetch(url, configObj).then(response => response.json())
// }

function post(url, objData){
    let configObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objData)
    };
    return fetch(url, configObj).then(response => response.json());
}


function patch(url, id, data){
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)
    }
    return fetch(`${url}${id}`, configObj).then(response => response.json())
}

// function destroy(url,id){
//     let configObj = {
//         method: "DELETE",
//         headers: {
//             "Content-Type": 'application/json'
//         }
//     }
//     return fetch(`${url}${id}`, configObj).then(response => response.json())
// }

function destroy(url, id){
    let configObj = {
        method: 'DELETE'
    };
    return fetch(`${url}${id}`, configObj).then(data => data.json());
}

// ---- constants ---- //
const caloriesUl = document.querySelector('#calories-list')
const entryForm = document.querySelector('#new-calorie-form')
const formBtn = document.querySelector('#form-Btn')
const calculateBtn = document.querySelector('#calculate-Btn')

const lowerBmr = document.querySelector('span#lower-bmr-range')
const upperBmr = document.querySelector('span#higher-bmr-range')

const bmrCalcForm = document.querySelector('#bmr-calulator')

// ---- functions ---- //
function getAllEntries(url){
    API.get(url).then(entriesList => entriesList.forEach(entry => {
        caloriesUl.append(renderEntry(entry))
    }))
}

function renderEntry(entry){
    //li 
    let li = document.createElement('li')
    li.className = "calories-list-item"
    li.id = `entry-${entry.id}`
    // class
    let ukGrid = document.createElement('div')
    ukGrid.className = "uk-grid"
    let ukGridWidth16 = document.createElement('div')
    ukGridWidth16.className = 'uk-width-1-6'
    ukGridWidth16.innerText = `${entry.calorie}`+ ` kcal`
    let ukGridWidth45 = document.createElement('div')
    ukGridWidth45.className = 'uk-width-4-5'
    let meta = document.createElement('em')
    meta.className = "uk-text-meta"
    meta.innerText = entry.note
    ukGridWidth45.append(meta)
    // next class
    let menu = document.createElement('div')
    menu.className = 'list-item-menu'
    let editBtn = document.createElement('a')
    editBtn.className = 'edit-button uk-icon'
    editBtn.setAttribute('uk-icon', 'icon: pencil')
    editBtn.setAttribute('uk-toggle', 'target: #edit-form-container')
    editBtn.addEventListener('click', () => handleEditClick(entry))
    let deleteBtn = document.createElement('a')
    deleteBtn.className = 'delete-button uk-icon'
    deleteBtn.setAttribute('uk-icon', 'icon: trash')
    deleteBtn.addEventListener('click', () => handleDeleteClick(entry))
    menu.append(editBtn, deleteBtn)
    // append
    ukGrid.append(ukGridWidth16, ukGridWidth45)
    li.append(ukGrid, menu)
    return li
}


// ----- calculate ----- //
function calcBMR(){
    event.preventDefault()
    let weight = event.target[0].value
    let height = event.target[1].value
    let age = event.target[2].value
    let lowerRange = 655 + (4.35 * `${weight}`) + (4.7 * `${height}`) - (4.7 * `${age}`) 
    let higherRange = 66 + (6.23 * `${weight}`) + (12.7 * `${height}`) - (6.8 * `${age}`) 
    console.log(lowerRange)
    console.log(higherRange)
    lowerBmr.innerText = lowerRange
    upperBmr.innerText = higherRange
}

bmrCalcForm.addEventListener('submit', calcBMR)

// ----- new ----- //
entryForm.addEventListener('submit', addEntry)

function addEntry(event) {
    event.preventDefault()
    let newEntry = { 
        api_v1_calorie_entry: {
            calorie: event.target[0].value,
            note: event.target[1].value
        }
    }
    API.post(baseURL, newEntry).then(entry => postOnClient(entry))
}

function postOnClient(event){
    caloriesUl.append(renderEntry(event))

}
// ----- edit ----- //
function handleEditClick(entry){
    console.log(entry)
}

// ----- delete ----- //
function handleDeleteClick(entry){
    API.destroy(baseURL, `${entry.id}`).then(entry => removeEntryOnClient(entry))
}

function removeEntryOnClient(entry){
    console.log(`goodbye, ${entry.id}`)
    let deadLi = document.querySelector(`#entry-${entry.id}`)
    deadLi.remove()
}

// ---- on load ---- //
getAllEntries(baseURL)