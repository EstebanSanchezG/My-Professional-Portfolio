const ARROW = 
`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
</svg>`;
const ADD_NEW =
`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg>`;

const newSwitch = (state) => {
    let switchElement = document.createElement("div");
    switchElement.classList.add("ManageSwitch");
    let label = document.createElement("label");
    label.classList.add("switch");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "IsActive";
    checkbox.checked = state;
    let slider = document.createElement("span");
    slider.classList.add("slider");
    slider.classList.add("round");

    label.appendChild(checkbox);
    label.appendChild(slider);
    switchElement.appendChild(label);

    return switchElement;
};

const subareaCard = element => {
    console.log("Escuchame akabo de tener el peor dia de mi vida, weon");
    let dataElement = document.createElement("div");
    dataElement.classList.add("WrapSubelement");
    let subareaTitle = document.createElement("span");
    subareaTitle.classList.add("ManageTitle2");
    subareaTitle.innerHTML = element.name;
    dataElement.appendChild( subareaTitle );
    dataElement.appendChild( newSwitch(element.state) );

    return dataElement;
};

const maintainCard = object => {
    let cardElement = document.createElement("div");
    cardElement.classList.add("ManageReduced");
    cardElement.classList.add("ManageElement");
    cardElement.classList.add("WrapElement");
    cardElement.classList.add("darker");
    let collapsible = document.createElement("div");
    collapsible.classList.add("Collapse");
    let areaData = document.createElement("div");
    areaData.classList.add("AreaData");
    let areaDataTitle = document.createElement("h3");
    areaDataTitle.classList.add("ManageTitle");
    areaDataTitle.innerHTML = object.name;
    areaData.appendChild( areaDataTitle );
    areaData.appendChild( newSwitch(object.state) );
    let subareaElement = document.createElement("div");
    subareaElement.classList.add("Column");
    subareaElement.classList.add("hide");
    object.subareas.forEach(element => {
        subareaElement.appendChild( subareaCard(element) );
    });
    subareaElement.appendChild( addNew(subareaElement, subareaCard, false) );
    collapsible.appendChild(areaData);
    collapsible.appendChild(subareaElement);
    collapsible.innerHTML += ARROW;
    let arrow = collapsible.children[2];
    cardElement.appendChild( collapsible );

    arrow.addEventListener("click", () => {
        arrow.classList.toggle("Rotate180");
        let parent = collapsible.parentNode;
        parent.classList.toggle("ManageReduced");
        parent.classList.toggle("ManageMaxed");
        let content = collapsible.children[1];
        content.classList.toggle("hide");
    });

    return cardElement;
};

const messageCard = (message) => {
    let container = document.createElement("div");
    container.classList.add("WrapMessage");
    container.classList.add("darker");
    let messageData = document.createElement("div");
    messageData.classList.add("Collapse");
    let messageDataTitle = document.createElement("span");
    messageDataTitle.classList.add("ManageTitle2");
    messageDataTitle.innerHTML = message.name;
    messageData.appendChild( messageDataTitle );
    messageData.appendChild( newSwitch(message.state) );
    container.appendChild( messageData );

    return container;
};

const addNew = (parent, create, isDarker=true) => {
    console.log(parent);
    let container = document.createElement("div");
    container.classList.add("AddElement");

    let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "New Categorie";

    let addButton = document.createElement("span");
        addButton.classList.add("WrapElement");
        if(isDarker){addButton.classList.add("darker");}
        addButton.innerHTML = ADD_NEW;
        addButton.addEventListener("click", () => {
            console.log("HMMM...");
            let aux = {
                name: input.value,
                state: true,
                subareas: []
            };
            parent.prepend( create( aux ) );
        });
    
    container.appendChild(input);
    container.appendChild(addButton);
    return container;
};

function LoadMaintenance(){
    let articleElement = document.getElementById("RelevantContent");
    let sectionElement = document.createElement("section");
    sectionElement.classList.add("wrap");
    sectionElement.id = "Users";
    let mainTitle = document.createElement("h1");
    mainTitle.innerHTML = "Feedback Channel";
    let areaTitle = document.createElement("h2");
    areaTitle.innerHTML = "Area";

    let areaDiv = document.createElement("div");
    areaDiv.id = "ManageArea";
    areaDiv.classList.add("FlexCenter");
    
    let obj = {
        name: "Human Resources",
        subareas: [{
            name:"Finanzas",
            state: true
        },{
            name:"Telemundo",
            state: false
        },{
            name:"Ceral de esos baratos",
            state: true
        }],
        state: true
    };
    areaDiv.appendChild( maintainCard(obj) );
    areaDiv.appendChild( maintainCard(obj) );
    areaDiv.appendChild( maintainCard(obj) );
    areaDiv.appendChild( maintainCard(obj) );
    areaDiv.appendChild( addNew(areaDiv, maintainCard) );

    let messageTitle = document.createElement("h2");
    messageTitle.innerHTML = "Types of Message";
    let messageDiv = document.createElement("div");
    messageDiv.id = "ManageTypes";
    messageDiv.classList.add("FlexCenter");
    messageDiv.appendChild( messageCard({name:"Congratulation",state:true}) );
    messageDiv.appendChild( messageCard({name:"Question",state:false}) );
    messageDiv.appendChild( messageCard({name:"Complaint",state:true}) );
    messageDiv.appendChild( messageCard({name:"Sugestion",state:false}) );
    messageDiv.appendChild( messageCard({name:"Other",state:true}) );
    messageDiv.appendChild( addNew(messageDiv, messageCard) );

    sectionElement.appendChild( mainTitle );
    sectionElement.appendChild( areaTitle );
    sectionElement.appendChild( areaDiv );
    sectionElement.appendChild( messageTitle );
    sectionElement.appendChild( messageDiv );
    articleElement.appendChild( sectionElement );
}