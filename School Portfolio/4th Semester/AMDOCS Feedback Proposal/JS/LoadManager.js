const USER_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"bi bi-person-fill\" viewBox=\"0 0 16 16\"><path d=\"M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\"/></svg>";
const USER_ADD =
`<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
</svg>`;


var areas = ["Human Resorces", "Engineering", "Facilities", "Operations"];
var subareas = ["Option 1", "Option 2", "Option 3", "Option 4", "Other"];

var nombres = ["Neto", "Germion", "Saucerdo", "Esteben", "Gera", "Mr.Boombastic", "ZukoDeAgua", "Valunch", "TsuruTuneado"];

function NewUser(user){
    var contentElement = document.createElement("div");
    contentElement.classList.add("Emploee");
    // contentElement.classList.add("darker");
    contentElement.id = "user" + user.id.toString();

    var emailElement = document.createElement("div");
    emailElement.classList.add("EmploeeMail");
    emailElement.innerHTML = USER_ICON + `<span>${user.email}</span>`;
    
    var selectElement = document.createElement("select");
    selectElement.name = "Area";
    selectElement.id = "area" + user.id.toString();
    selectElement.classList.add("AreaSelect");
    for (let index = 0; index < areas.length; ++index) {
        let optionElement = document.createElement("option");
        optionElement.value = areas[index];
        optionElement.innerHTML = areas[index];
        selectElement.appendChild(optionElement);
    }
    selectElement.selectedIndex = user.area;

    var focalSwitchElement = CreateSwitch( "isFocal" + user.id.toString(), "Focal Point", user.isFocal );
    focalSwitchElement.classList.add("FocalSwitch");
    var adminSwitchElement = CreateSwitch( "isAdmin" + user.id.toString(), "Admin", user.isAdmin );
    adminSwitchElement.classList.add("AdminSwitch");

    contentElement.appendChild(emailElement);
    contentElement.appendChild(selectElement);
    contentElement.appendChild(focalSwitchElement);
    contentElement.appendChild(adminSwitchElement);

    return contentElement;
}
function SetChecked(){

    return ( Math.floor(Math.random() * 100) ) % 2;
}
function SetIndex(){

    return ( Math.floor(Math.random() * areas.length) );
}
function CreateSwitch(switchId, title, state){
    let divElement = document.createElement("div");
    var contextElement = document.createElement("span");
    contextElement.innerHTML = title;
    var labelElement = document.createElement("label");
    labelElement.classList.add("switch");

    var inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = switchId;
    inputElement.checked = state;
    var sliderElement = document.createElement("span");
    sliderElement.classList.add("slider");
    sliderElement.classList.add("round");

    labelElement.appendChild(inputElement);
    labelElement.appendChild(sliderElement);

    divElement.appendChild(contextElement);
    divElement.appendChild(labelElement);

    return divElement;
}
function SetUsers(){
    var articleElement = document.getElementById("RelevantContent");
    let sectionElement = document.createElement("section");
    let userSection = document.createElement("div");
    sectionElement.classList.add("wrap");
    sectionElement.id = "User";
        let titleH1 = document.createElement("H1");
        titleH1.innerHTML = "E-Mail";
        let emailInput = document.createElement("div");
        emailInput.classList.add("EmailInput");
            let input = document.createElement("input");
            input.type = "email";
            input.name = "mail";
            input.id = "UserEmail";
            input.placeholder = "example@amdocs.mx";
        emailInput.appendChild(input);
        emailInput.innerHTML += USER_ADD;
        emailInput.children[1].addEventListener("click", () =>{
            let aux = {
                id: 10,
                email: emailInput.children[0].value.toLowerCase(),
                area: SetIndex(),
                isFocal: false,
                isAdmin: false
            };
            userSection.prepend( NewUser(aux) )
        });
    sectionElement.appendChild(titleH1);
    sectionElement.appendChild(emailInput);

    var cases = Math.floor(Math.random() * 100);
    for (let i = 0; i < cases; ++i) {
        let aux = {
            id: i,
            email: `${nombres[ Math.floor(Math.random() * nombres.length) ]}@amdocs.com`,
            area: SetIndex(),
            isFocal: SetChecked(),
            isAdmin: SetChecked()
        };
        userSection.appendChild( NewUser( aux ) );
    }
    sectionElement.appendChild( userSection );

    articleElement.appendChild( sectionElement );
}