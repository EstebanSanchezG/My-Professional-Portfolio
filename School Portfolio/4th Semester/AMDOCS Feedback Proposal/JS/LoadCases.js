const MESSAGE_PLACEHOLDER = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const MANAGE_CASE_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-three-dots\" viewBox=\"0 0 16 16\"><path d=\"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z\"/></svg>";
const EXPAND_CASE_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-fullscreen\" viewBox=\"0 0 16 16\"><path d=\"M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z\"/></svg>";

var statusOptions = ['NewCase', 'OpenCase', 'ClosedCase'];
var areas = ["Human Resorces", "Engineering", "Facilities", "Operations", "Other"];
var subareas = ["Option 1", "Option 2", "Option 3", "Option 4", "Other"];
var typesOfMessages = ["Congratulation", "Complaint", "Suggestion", "Doubt", "Other"];





function NewCase(caseId){
    var sectionElement = document.createElement("section");
    sectionElement.classList.add("case");
    sectionElement.classList.add( SetStatut() );
    sectionElement.id = caseId;

    var manageElement = document.createElement("div");
    manageElement.classList.add("ManageCase");
    manageElement.innerHTML = MANAGE_CASE_ICON;
    var expandElement = document.createElement("div");
    expandElement.classList.add("ExpandCase");
    expandElement.innerHTML = EXPAND_CASE_ICON;

    var contentElement = RandomCase();

    sectionElement.appendChild(manageElement);
    sectionElement.appendChild(contentElement);
    sectionElement.appendChild(expandElement);

    return sectionElement;
}
function SetStatut(){
    return statusOptions[ Math.floor(Math.random() * statusOptions.length) ];
}
function SetArea(){
    return areas[ Math.floor(Math.random() * areas.length) ];
}
function SetSubarea(){
    return subareas[ Math.floor(Math.random() * subareas.length) ];
}
function SetType(){
    return typesOfMessages[ Math.floor(Math.random() * typesOfMessages.length) ];
}
function SetDays(){
    return `${Math.floor(Math.random() * 100)}`;
}
function RandomCase(){
    let divElement = document.createElement("div");
    var areaElement = document.createElement("p");
    areaElement.classList.add("Atribute");
    areaElement.innerHTML = "<span>Area: </span>" + SetArea();

    var subareaElement = document.createElement("p");
    subareaElement.classList.add("Atribute");
    subareaElement.innerHTML = "<span>Subarea: </span>" + SetSubarea();

    var typeOMElement = document.createElement("p");
    typeOMElement.classList.add("Atribute");
    typeOMElement.innerHTML = "<span>Type: </span>" + SetType();

    var messageElement = document.createElement("p");
    messageElement.classList.add("Atribute");
    messageElement.classList.add("Message");
    messageElement.innerHTML = "<span>Message: </span>" + MESSAGE_PLACEHOLDER;

    var daysOpenElement = document.createElement("p");
    daysOpenElement.classList.add("Atribute");
    daysOpenElement.innerHTML = "<span>Days: </span>" + SetDays();

    divElement.appendChild(areaElement);
    divElement.appendChild(subareaElement);
    divElement.appendChild(typeOMElement);
    divElement.appendChild(messageElement);
    divElement.appendChild(daysOpenElement);

    return divElement;
}
function SetMyCases(){
    var articleElement = document.getElementById("RelevantContent");
    articleElement.classList.add("FlexCenter");
    var cases = Math.floor(Math.random() * 100);
    for (let i = 0; i < cases; ++i) {
        articleElement.appendChild( NewCase("case"+i.toString()) );
    }
}
function SetAreaCases(){
    var articleElement = document.getElementById("RelevantContent");
    articleElement.classList.add("FlexCenter");
    var cases = Math.floor(Math.random() * 100);
    for (let i = 0; i < cases; ++i) {
        articleElement.appendChild( NewCase("case"+i.toString()) );
    }
}