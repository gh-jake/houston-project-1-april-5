document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("submit", formSubmitted);
    document.getElementById("button").addEventListener("click", backFunction);
});

function formSubmitted(event) {
    event.preventDefault();
    getResults();
    document.getElementById("nameInput").value = "";
    document.getElementById("countryInput").value = "";
}

function getResults() {
    nameInput = document.getElementById("nameInput").value;
    countryInput = document.getElementById("countryInput").value;

    if(countryInput.length === 0 && nameInput.length != 0) {
        fetchAge(`https://api.agify.io?name=${nameInput}`);
    }
    else if(nameInput.length === 0) {
        alert("Error: Please enter a name.");
    }
    else {
        fetchAge(`https://api.agify.io?name=${nameInput}&country_id=${countryInput}`);
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
            postAge(data.age);
        }
    })
    .catch(error => alert(error));
}

function postAge(ageResult) {
    ageP = document.getElementById("age-h3");
    ageP.innerHTML = ageResult;   
}

function backFunction() {
    document.getElementById("form-section").hidden = false;
    document.getElementById("age-section").hidden = true;
}