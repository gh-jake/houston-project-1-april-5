let currentName;
let currentAge;
let currentCountry;
let hasCountry;

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("submit", formSubmitted);
    document.getElementById("back-button").addEventListener("click", backFunction);
    document.getElementById("save-name-button").addEventListener("click", saveNameFunction);
    fetchCountries();
});

function formSubmitted(event) {
    event.preventDefault();
    hasCountry = false;
    getResults();
    document.getElementById("nameInput").value = "";
}

function fetchCountries() {
    dropDown = document.getElementById("countries");
    fetch("https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(country => {
            menuItem = document.createElement("option");
            menuItem.innerHTML = country.Name;
            menuItem.setAttribute("value", country.Code);
            dropDown.appendChild(menuItem);
        });
    })
    .catch(error => alert(error));
}

function getResults() {
    nameInput = document.getElementById("nameInput").value;
    currentName = capitalize(nameInput);
    countryInput = document.getElementById("countries").value;

    if(countryInput === "select" && nameInput.length != 0) {
        fetchAge(`https://api.agify.io?name=${nameInput}`);
    }
    else if(nameInput.length === 0) {
        alert("Error: Please enter a name.");
    }
    else {
        fetchAge(`https://api.agify.io?name=${nameInput}&country_id=${countryInput}`);
        currentCountry = countryInput;
        hasCountry = true;
    }
}

function fetchAge(url) {
   fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data.age === null) {
            alert("Error: Name not found.");
        }
        else {
            document.getElementById("form-section").hidden = true;
            document.getElementById("age-section").hidden = false;
            // document.getElementById("saved-names-section").hidden = false;
            document.getElementById("buttons-section").hidden = false;
            countries = document.getElementsByTagName("select");
            for (let i = 0; i < countries.length; i++) {
                countries[i].selectedIndex = 0;
            }
            postAge(data.age);
        }
    })
    .catch(error => alert(error));
}

function postAge(ageResult) {
    document.getElementById("country-section").hidden = true;
    ageH3 = document.getElementById("age-h3");
    nameH3 = document.getElementById("name-h3");
    if (hasCountry) {
        document.getElementById("country-h3").innerHTML = currentCountry;
        document.getElementById("country-section").hidden = false;
    }
    ageH3.innerHTML = ageResult;  
    currentAge = ageResult; 
    nameH3.innerHTML = capitalize(currentName);
}

function backFunction() {
    document.getElementById("form-section").hidden = false;
    document.getElementById("age-section").hidden = true;
    document.getElementById("buttons-section").hidden = true;
    if (document.getElementById("saved-names-section").getElementsByTagName("li").length === 0) {
        document.getElementById("saved-names-section").hidden = true;
    }
}

function saveNameFunction() {
    document.getElementById("saved-names-section").hidden = false;
    ul = document.getElementById("saved-names");
    li = document.createElement("li");
    if (hasCountry) {
        li.innerText = `${currentName} (${currentCountry}), ${currentAge} `;
    }
    else {
        li.innerText = `${currentName}, ${currentAge} `;
    }
    xButton = document.createElement("button");
    xButton.innerHTML = "x";
    br = document.createElement("br");
    li.appendChild(xButton);
    li.appendChild(br);
    ul.appendChild(li);
    xButton.addEventListener("click", deleteFunction);
}

function deleteFunction(event) {
    ul = event.target.parentNode.parentNode;
    ul.removeChild(event.target.parentNode);
    if (ul.getElementsByTagName("li").length < 1) {
        document.getElementById("saved-names-section").hidden = true;
    }
}

function capitalize(word) {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
}
