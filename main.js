// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const BASE_URL = "http://localhost:3000/api/v1/calorie_entries/"

function rToJson(response) {
    return response.json()
}

function get(url) {
    return fetch(url).then(rToJson)
}

function post(url, data) {
    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(url, configObj).then(rToJson)
}

function patch(url, id, data) {
    const configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(url+id, configObj).then(rToJson)
}

function destroy(url, id) {
    const configObj = {
        method: "DELETE"
    }
    return fetch(url+id, configObj).then(rToJson)
}

const API = {
    get, post, patch, destroy
}

document.addEventListener("DOMContentLoaded", () => {
    // Vars and consts -------------
    const caloriesList = document.querySelector('ul#calories-list')
    const newCalorieForm = document.querySelector('form#new-calorie-form')
    const progressBar = document.querySelector('progress')
    const editCalorieForm = document.querySelector('form#edit-calorie-form')
    const closeEditFormBtn = document.querySelector('button.uk-modal-close-default.uk-close')
    const editFormContainer = document.querySelector('div#edit-form-container')
    const BMRCalcForm = document.querySelector('form#bmr-calulator')

    // Functions -----------

    // Get and render calories

    function getAndRenderAllCalories() {
        API.get(BASE_URL).then(createAndAppendAllCalorieLis)
    }

    function createAndAppendAllCalorieLis(foods) {
        foods = foods.reverse()
        progressBar.value = calculateSumOfCalories(foods)
        foods.forEach(food => caloriesList.append(createCalorieLi(food)))
    }

    function createCalorieLi(food) {
        let li = document.createElement('li')
        li.classList.add("calories-list-item")
        li.dataset.id = food.id

        let mainContentDiv = document.createElement('div')
        mainContentDiv.classList.add("uk-grid")

        let calorieContentDiv = document.createElement('div')
        calorieContentDiv.classList.add("uk-width-1-6")

        let calorieContent = document.createElement('strong')
        calorieContent.innerText = food.calorie
        calorieContent.setAttribute('data-id', food.id)

        let calorieScale = document.createElement('span')
        calorieScale.innerText = " kcal"

        calorieContentDiv.append(calorieContent, calorieScale)

        let foodNoteDiv = document.createElement('div')
        foodNoteDiv.classList.add("uk-width-4-5")

        let foodNote = document.createElement('em')
        foodNote.classList.add("uk-text-meta")
        foodNote.innerText = food.note
        foodNote.setAttribute('data-id', food.id)


        foodNoteDiv.append(foodNote)

        mainContentDiv.append(calorieContentDiv, foodNoteDiv)

        let actionsDiv = document.createElement('div')
        actionsDiv.classList.add("list-item-menu")
        
        let editBtn = document.createElement('a')
        editBtn.classList.add("edit-button")
        editBtn.setAttribute('uk-icon', "icon: pencil")
        editBtn.setAttribute('uk-toggle', "target: #edit-form-container")
        editBtn.setAttribute('data-calorie-id', food.id)
        editBtn.addEventListener('click', (e) => {
            handleEditBtnClick(e, food)
        })


        let delBtn = document.createElement('a')
        delBtn.classList.add("delete-button")
        delBtn.setAttribute('uk-icon', "icon: trash")
        delBtn.setAttribute('data-calorie-id', food.id)
        delBtn.addEventListener('click', handleDeleteCalorieBtnClick)

        actionsDiv.append(editBtn, delBtn)

        li.append(mainContentDiv, actionsDiv)

        return li
    }

    // add new calorie food count

    function handleNewCalorieFormSubmit(e) {
        e.preventDefault()
        const form = e.target
        const calorie = Number(form[0].value)
        const note = form[1].value
        if (calorie.length !== 0 && note.length !== 0) {
            const data = {
                api_v1_calorie_entry: {
                    calorie, 
                    note
                }
            }
            API.post(BASE_URL, data).then(prependCalorieToList)
        } else {
            let errorMsg = createCalorieFormError("Values cannot be empty!")
            form.prepend(errorMsg)
            setTimeout(() => errorMsg.remove(), 2000)
        }
    }

    function createCalorieFormError(message) {
        let h4 = document.createElement('h4')
        h4.style.backgroundColor = 'black'
        h4.style.color = 'orange'
        h4.innerText = message
        h4.style.textAlign = 'center'
        return h4
    }

    function prependCalorieToList(calorieFood) {
        progressBar.value += calculateSumOfCalories([calorieFood])
        console.log(progressBar.value)
        caloriesList.prepend(createCalorieLi(calorieFood))
    }

    function calculateSumOfCalories(foods) {
        return foods.map(food => food.calorie).reduce((total, calorie) => total+calorie)
    }

    // Delete Buttons for calories

    function handleDeleteCalorieBtnClick(e) {
        let calId = e.currentTarget.dataset.calorieId
        API.destroy(BASE_URL, calId).then(removeCalorieFromList)
    }

    function removeCalorieFromList(calorie) {
        progressBar.value -= calorie.calorie
        document.querySelector(`li[data-id="${calorie.id}"`).remove()
    }


    // Edit Button
    function handleEditBtnClick(e, data) {
        let id = data.id

        editCalorieForm[0].value = document.querySelector(`strong[data-id="${id}"]`).innerText
        editCalorieForm[1].value = document.querySelector(`em[data-id="${id}"]`).innerText
        editCalorieForm[2].setAttribute('data-calorie-id', id)
    }

    // Edit Form

    function handleEditFormSubmit(e) {
        e.preventDefault()
        let calorie = editCalorieForm[0].value
        let note = editCalorieForm[1].value
        let id = editCalorieForm[2].dataset.calorieId
        if (calorie.length !== 0 && note.length !== 0) {
            let data = { 
                api_v1_calorie_entry: {
                    calorie, 
                    note
                } 
            }
            editFormContainer.style = ''
            editFormContainer.classList.remove("uk-open")
            API.patch(BASE_URL, id, data).then(renderCalorieAfterEdit)
        } else {
            let errorMsg = createCalorieFormError("Values cannot be empty!")
            editCalorieForm.prepend(errorMsg)
            setTimeout(() => errorMsg.remove(), 2000)
        }

    }

    function handleCloseEditFormClick(e) {
        editCalorieForm.reset()
        editCalorieForm[2].removeAttribute('data-calorie-id')
    }

    function renderCalorieAfterEdit(calorie) {
        let calContent = document.querySelector(`strong[data-id="${calorie.id}"]`)
        let calNote = document.querySelector(`em[data-id="${calorie.id}"]`)

        let calories = parseInt(calContent.innerText)
        
        if (calories > calorie.calorie) {
            let caloriesToRemove = calories - calorie.calorie
            progressBar.value -= caloriesToRemove
        } else {
            let caloriesToAdd = calorie.calorie - calories
            progressBar.value += caloriesToAdd
        }

        calContent.innerText = calorie.calorie
        calNote.innerText = calorie.note
    }

    // BMR Form

    function handleBMRFormSubmit(e) {
        e.preventDefault()
        
        let weight = parseInt(e.target[0].value)
        let height = parseInt(e.target[1].value)
        let age = parseInt(e.target[2].value)
       
        let lowerBMR = Math.round(655 + (4.35*weight) + (4.7*height) - (4.7 * age))
        let upperBMR = Math.round(66 + (6.23*weight) + (12.7*height) - (6.8*age))

        let lowerDisplay = document.querySelector('span#lower-bmr-range')
        let upperDisplay = document.querySelector('span#higher-bmr-range')

        lowerDisplay.innerText = lowerBMR
        upperDisplay.innerText = upperBMR

        progressBar.max = (lowerBMR+upperBMR)/2
        API.get(BASE_URL).then(calories => {
            progressBar.value = calculateSumOfCalories(calories)
        })
    }


    // event listeners and actions -----------

    getAndRenderAllCalories()

    newCalorieForm.addEventListener('submit', handleNewCalorieFormSubmit)

    editCalorieForm.addEventListener('submit', handleEditFormSubmit)

    closeEditFormBtn.addEventListener('click', handleCloseEditFormClick)

    BMRCalcForm.addEventListener('submit', handleBMRFormSubmit)
})