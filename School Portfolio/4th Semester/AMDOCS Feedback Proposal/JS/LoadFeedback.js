var areas = [{
    name: "Human Resorces",
    id: "HR",
    subareas: ["HR1", "HR2", "HR3", "HR4"]
}, {
    name: "Engineering",
    id: "Eng",
    subareas: ["Eng1", "Eng2", "Eng3", "Eng4", "Eng5"]
}, {
    name: "Facilities",
    id: "Fa",
    subareas: ["Fa1", "Fa2", "Fa3"]
}, {
    name: "Operations",
    id: "Op",
    subareas: ["Op1", "Op2", "Op3", "Op4", "Op5", "Op6", "Op7", "Op8"]
}, {
    name: "Other",
    id: "Other",
    subareas: ["Other"]
}];
var typesOfMessages = [{
    name: "Congratulation",
    id: "Congrats"
},{
    name: "Complaint",
    id: "Complaint"
},{
    name: "Suggestion",
    id: "Suggestion"
},{
    name: "Doubt",
    id: "Doubt"
},{
    name: "Other",
    id: "Other"
}];
let flagSubareas = 0;
let flagTypeMsg = 0;

function Areas() {
    LoadRadio("area", areas, "radioB", "checkmark", "areaDiv", block1 = null, block2 = null)
}

function SubAreas( subareas ) {
    displayElement("blockSubareas");
    let padre = document.getElementById("subareaSelect");
    padre.replaceChildren();
    for (let i = 0; i < subareas.length; ++i) { //cambiar el length por el de la base de datos :p
        let option = document.createElement("option");
        option.value = "opt" + i;
        option.innerHTML = subareas[i];
        padre.appendChild(option);
    }
    padre.addEventListener("change", () => {
        typeMsg();
    });
}

function typeMsg() {
    if (flagTypeMsg === 0) {
        displayElement("blockTypeMsg");
        LoadRadio("type", typesOfMessages, "radioBox", "checkbox", "divTypeMsg", "blockMsg", "blockFinish")
    }
    flagTypeMsg = 1;
}

function LoadRadio(name, lista, radioClass, checkClass, padreDiv, block1, block2 = null) {

    for (let i = 0; i < lista.length; i++) { //cambiar el length por el de la base de datos :p
        let padre = document.getElementById(padreDiv);
        let label = document.createElement("label");
        let radioB = document.createElement("input");
        let checkmark = document.createElement("span");
        radioB.type = "radio";
        radioB.name = name;
        label.classList.add(radioClass);
        radioB.id = lista[i].id;
        if (block1 === null) {
            radioB.onclick = () => SubAreas(lista[i].subareas)
        } else {
            radioB.onclick = () => displayElement(block1, block2);
        }
        checkmark.className = checkClass;
        label.innerHTML = lista[i].name;

        label.appendChild(radioB);
        label.appendChild(checkmark);
        padre.appendChild(label);

    }
}

function displayElement(id, id2 = null) {
    let block1 = document.getElementById(id);
    block1.classList.remove("hide");
    if (id2) {
        let block2 = document.getElementById(id2);
        block2.classList.remove("hide");
    }
}

Areas();