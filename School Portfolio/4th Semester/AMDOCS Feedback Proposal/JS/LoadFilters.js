const LUPA =
`<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-search" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
</svg>`;
const FILTER =
`<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-funnel" viewBox="0 0 16 16">
    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
</svg>`;

function HideButton( page ){
    let filter = document.getElementById("Filters").children;
    let button = filter[0];
    button.className  = "Button";
    if( page == "index"){
        let searchInput = document.getElementById("Filters").children[1].children[1];
        searchInput.addEventListener("keydown", () => {
            caseSearch();
        });
    }
    else if( page == "usermanager.html" ){
        button.href = "#";
        button.innerHTML = "Save Changes";
        button.addEventListener("click", () => {
            console.log("Rifado 😈");
        });
        let searchInput = document.getElementById("Filters").children[1].children[1];
        searchInput.addEventListener("keydown", () => {
            userSearch();
        });
    }
    else if( page == "dashboard.html" ){
        button.href = "SRC/FeedbackData.csv";
        button.download = true;
        button.innerHTML = "Export Data";
        button.addEventListener("click", () => {
            console.log("Crack 😈");
        });
        filter[1].classList.toggle("hide");
    }
}
function caseSearch() {
    let searchBar = document.getElementById("Filters").children[1].children[1];
    segment = searchBar.value.toLowerCase().trim();
    let cards = document.getElementById("RelevantContent").children;
    for (i=0; i<cards.length; ++i) {
        let card = cards[i].children[1].children;
        var hasContent = false;
        for (j=0; j<card.length; ++j){
            let atribute = card[j].lastChild.textContent.toLowerCase();
            if( atribute.indexOf(segment) > -1 ){
                hasContent = true;
                break;
            }
        }
        if(!hasContent) cards[i].classList.add("hide");
        else cards[i].classList.remove("hide");
    }
}

function userSearch() {
    let searchBar = document.getElementById("Filters").children[1].children[1];
    emploee = searchBar.value.toLowerCase().trim();
    let users = document.getElementById("RelevantContent").children[0].children[2].children;

    for (i=0; i<users.length; ++i) {
        let thisUser = users[i];
        let email = thisUser.children[0].children[1].textContent.toLowerCase();
        if( email.indexOf(emploee) > -1 )
            thisUser.classList.remove("hide");
        else thisUser.classList.add("hide"); 
    }
}

function LoadFilters(){

    let filterElement = document.createElement("div");
    filterElement.classList.add("Filters");
    filterElement.id = "Filters";
    let ancorElement = document.createElement("a");
        ancorElement.classList.add("Button");
        ancorElement.href = "FeedBack.html";
        ancorElement.innerHTML = "Send Feedback";
    let searchBar = document.createElement("div");
    searchBar.classList.add("SearchBar");
        searchBar.innerHTML = LUPA;
        let searchInput = document.createElement("input");
            searchInput.type = "text";
            searchInput.name = "ToSearch";
            searchInput.id = "Search";
            searchInput.placeholder = "Search";
        searchBar.appendChild(searchInput);
    let filterSelect = document.createElement("div");
    filterSelect.classList.add("FilterSelect");
        filterSelect.innerHTML = FILTER;
    
    filterElement.appendChild(ancorElement);
    filterElement.appendChild(searchBar);
    filterElement.appendChild(filterSelect);

    return filterElement;
}