const LOGO_LINK = "Images/LogoWName.png";
const USER_SVG = 
`<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-person-fill" viewBox="0 0 16 16">
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg>`;
const LOGOUT_SVG =
`<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
    <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
</svg>`;
const USER_NAME = "Neto Dios";

function LoadHeader(){
    let headerDiv = document.createElement("div");
    headerDiv.classList.add("NavWrap");
    let logoAncor = document.createElement("a");
    logoAncor.href = "/index.html";
    let logo = document.createElement("img");
    logo.src = LOGO_LINK;
    logo.alt = "AMDOCS";
    logoAncor.appendChild(logo);
    let userDiv = document.createElement("div");
    userDiv.classList.add("User");
    let userIcon = document.createElement("div");
    userIcon.classList.add("UserIcon");
    let dropdown = document.createElement("a");
    dropdown.classList.add("OptionMenu");
    dropdown.href = "Login.html";
    let option = document.createElement("div");
    let logout = document.createElement("span");
    logout.innerHTML = "Logout";
    option.innerHTML = LOGOUT_SVG;
    option.appendChild(logout);
    dropdown.appendChild(option);
    userIcon.innerHTML = USER_SVG;
    userIcon.appendChild(dropdown);
    let userInfo = document.createElement("div");
    userInfo.classList.add("UserInfo");
    let userName = document.createElement("span");
    userName.classList.add("UserName");
    userName.innerHTML = USER_NAME;
    userInfo.appendChild(userName);
    userDiv.appendChild(userIcon);
    userDiv.appendChild(userInfo);
    headerDiv.appendChild(logoAncor);
    headerDiv.appendChild(userDiv);

    let header = document.getElementById("Header");
    header.appendChild(headerDiv);
}

LoadHeader();