"use strict";

const TAGS = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "div",
    "p",
    "span",
    "img",
    "a",
    "i",
    "button",
];

let myData = {};

window.onload = function () {
    loadData(
        "https://raw.githubusercontent.com/MikeBidinger/Resume/8072ae76bf2861354395ebfa553cde0fad4fa71d/data/data.json"
    );
};

async function loadData(url_addr) {
    let myDataText = "";
    // myDataText = JSON.stringify(MYDATA);
    let myPromise = new Promise(function (resolve, reject) {
        const req = new XMLHttpRequest();
        req.onload = function () {
            if (req.status === 200) {
                myDataText = req.responseText;
                resolve();
            }
        };
        req.open("GET", url_addr);
        req.send();
    });
    await myPromise;
    loadJSONdata("EN", myDataText);
    createNavigationBar(document.getElementById("Nav"));
}

function loadJSONdata(lang, dataText) {
    myData = JSON.parse(dataText);
    for (let section in myData) {
        let parent = document.getElementById(section);
        parseData(parent, lang, myData[section]);
    }
}

function parseData(parent, lang, sectionData) {
    if (typeof sectionData === "object") {
        for (let id in sectionData) {
            let element = createElement(lang, sectionData[id], id);
            parent.appendChild(element);
        }
    }
}

function createElement(lang, elementData, id) {
    let element = document.createElement(elementData.tag);
    element.id = id;
    addProperties(element, lang, elementData);
    return element;
}

function addProperties(element, lang, elementData) {
    if (elementData.tag === undefined) return;
    for (let x in elementData) {
        // If property (data) is an element
        if (elementData[x].tag !== undefined) {
            let child = createElement(lang, elementData[x], x);
            element.appendChild(child);
            // Set attributes
        } else if (x === "class") {
            element.classList.add(elementData.class);
        } else if (x === "innerHTML") {
            if (typeof elementData.innerHTML === "object") {
                element.innerHTML = elementData.innerHTML[lang];
            } else {
                element.innerHTML = elementData.innerHTML;
            }
        } else if (x === "rating") {
            createRating(element, elementData.rating);
        }
        // For an imgage element
        if (element.tagName === "IMG") {
            if (x === "src") {
                element.src = elementData.src;
            } else if (x === "alt") {
                element.alt = elementData.alt;
            }
            // For a link element
        } else if (element.tagName === "A") {
            if (x === "href") {
                element.href = elementData.href;
            } else if (x === "target") {
                element.target = elementData.target;
            }
        }
    }
}

function createRating(parent, rating) {
    for (let i = 0; i < rating.amount; i++) {
        if (i < rating.amount - rating.score) {
            parent.appendChild(createRateIcon(false));
        } else {
            parent.appendChild(createRateIcon(true));
        }
    }
}

function createRateIcon(checked) {
    let element = document.createElement("i");
    element.classList.add("rating");
    element.classList.add("material-icons");
    if (checked) {
        element.innerHTML = "radio_button_checked";
    } else {
        element.innerHTML = "radio_button_unchecked";
    }
    return element;
}

function setLang(lang) {
    for (let section in myData) {
        setProperties(section, lang, myData[section]);
    }
    removeNavigationBar(document.getElementById("Nav"));
    createNavigationBar(document.getElementById("Nav"));
}

function setProperties(parentID, lang, elementData) {
    if (typeof elementData === "object") {
        if ("innerHTML" in elementData) {
            if (typeof elementData.innerHTML === "object") {
                let element = document.getElementById(parentID);
                element.innerHTML = elementData.innerHTML[lang];
            }
        }
        for (let element in elementData) {
            setProperties(element, lang, elementData[element]);
        }
    }
}

function createNavigationBar(navbar) {
    // Home Link
    let link = document.createElement("a");
    link.id = "LinkHome";
    link.href = "#";
    link.innerHTML = "Home";
    navbar.appendChild(link);
    // Sideview Links
    let sideElements = document.getElementById("Sideview").children;
    createLinks(sideElements, navbar);
    // Main Content Links
    let mainElements = document.getElementById("MainContent").children;
    createLinks(mainElements, navbar);
    // Contact Link
    link = document.createElement("a");
    link.id = "LinkFooter";
    link.href = "#Footer";
    link.innerHTML = "Contact";
    navbar.appendChild(link);
    // Language Selection:
    // - Dropdown
    let dropdown = document.createElement("div");
    dropdown.id = "Dropdown";
    // - Dropdown Link
    let dropLink = document.createElement("a");
    dropLink.id = "DropLink";
    dropLink.innerHTML = "Language";
    // - Dropdown Buttons
    let dropButtons = document.createElement("div");
    dropButtons.id = "DropButtons";
    let dropEN = document.createElement("button");
    dropEN.onclick = function () {
        setLang("EN");
    };
    dropEN.innerHTML = "English";
    dropButtons.appendChild(dropEN);
    let dropNL = document.createElement("button");
    dropNL.onclick = function () {
        setLang("NL");
    };
    dropNL.innerHTML = "Dutch";
    dropButtons.appendChild(dropNL);
    let dropDE = document.createElement("button");
    dropDE.onclick = function () {
        setLang("DE");
    };
    dropDE.innerHTML = "German";
    dropButtons.appendChild(dropDE);
    // - Add Dropdown to NavBar
    dropdown.appendChild(dropLink);
    dropdown.appendChild(dropButtons);
    navbar.appendChild(dropdown);
}

function createLinks(elements, parent) {
    for (let div of elements) {
        if (div.tagName === "DIV") {
            let part = div.firstElementChild;
            let link = document.createElement("a");
            link.id = "Link" + div.id;
            link.href = "#" + div.id;
            link.innerHTML = part.innerHTML;
            parent.appendChild(link);
        }
    }
}

function removeNavigationBar(navbar) {
    navbar.removeChild(navbar.firstElementChild);
    let len = navbar.childNodes.length
    for (let i = 0; i < len; i++) {
        navbar.removeChild(navbar.firstElementChild);
    }
}
