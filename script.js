const accessKey = `KTQRXPKsX9igZ5xjZrqHFWiJAZSltFI15SlybbrRQCU`;
const form = document.querySelector("form");
const imgInput = document.getElementById("searh-input");
const searchResult = document.querySelector(".search-results");
const showMoreBtn =document.getElementById("show-btn");

let inputData = "";
let page = 1;

async function searchImg(){
    inputData = imgInput.value;
    const url = `https://api.unsplash.com/search/photos?page=$page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url)
    const data = await response.json()
    const results = data.results;

    if(page ===1){
        searchResult.innerHTML ="";
    }

    results.map((result) =>{
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add("search-result")
        const image = document.createElement('img')
        image.src = result.urls.small
        image.alt_description
        const imgLink = document.createElement("a")
        imgLink.href = result.links.html
        imgLink.target ="_blank"
        imgLink.textContent = result.alt_description

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imgLink);
        searchResult.appendChild(imageWrapper)
       
    })
    page++;
    if(page > 1){
        showMoreBtn.style.display = "block";

    }

}

form.addEventListener("submit",(event)=>{
    event.preventDefault()
    page = 1;
    searchImg()

}) 

showMoreBtn.addEventListener("click",()=>{
   
  
    searchImg();

}) 