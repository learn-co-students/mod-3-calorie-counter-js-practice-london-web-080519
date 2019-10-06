// --- API functions --- //

const API = {get, post, patch, destroy}
const baseURL = "http://localhost:3000/api/v1/calorie_entries/"

function get(url){
    return fetch(url).then(response => response.json())
}

function post(url, data)
    let configObj = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(url, configObj).then(response => response.json())
}

function patch(url, id, data){
    let configObj = {
        method: "PATCH", 
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(data)
    }
    return fetch(`${url}${id}`, configObj).then(response => response.json())
}

function destroy(url, id){
    let configObj ={
        method: "DELETE"
    }
    return fetch(`${url}${id}`, configObj).then(response => response.json())
}

// --- constants --- //
// --- functions --- //

// --- on load --- //