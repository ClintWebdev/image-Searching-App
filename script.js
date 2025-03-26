const accessKey = `KTQRXPKsX9igZ5xjZrqHFWiJAZSltFI15SlybbrRQCU`;

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.querySelector('.search-results');
const showMoreBtn = document.getElementById('show-btn');
const resultsTitle = document.getElementById('results-title');
const popularTags = document.querySelectorAll('.tag');

// Variables to track search state
let inputData = "";
let currentSearch = "";
let page = 1;

// Function to display placeholder content on initial load
function displayPlaceholderContent() {
    const placeholderImages = [
        { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', title: 'Abstract Gradient', author: 'Unknown' },
        { url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94', title: 'Sunset Landscape', author: 'Nature Explorer' },
        { url: 'https://images.unsplash.com/photo-1682687218147-9806132dc697', title: 'City Lights', author: 'Urban Photographer' },
        { url: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b', title: 'Ocean View', author: 'Sea Lover' },
    ];
    
    let placeholderHTML = '';
    placeholderImages.forEach(img => {
        placeholderHTML += `
        <div class="search-result">
            <a href="${img.url}" target="_blank">
                <img src="${img.url}?auto=format&w=600" alt="${img.title}">
            </a>
            <div class="image-info">
                <h3>${img.title}</h3>
                <p>By ${img.author}</p>
            </div>
        </div>
        `;
    });
    
    resultsContainer.innerHTML = placeholderHTML;
    showMoreBtn.style.display = 'none';
}

// Function to search for images using Unsplash API
async function searchImages(event) {
    if (event) {
        event.preventDefault();
    }
    
    currentSearch = searchInput.value.trim();
    inputData = currentSearch;
    
    if (!currentSearch) return;
    
    resultsTitle.textContent = `Search Results for "${currentSearch}"`;
    
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    try {
        // Show loading state
        if (page === 1) {
            resultsContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Loading results...</p>';
        }
        
        const response = await fetch(url);
        const data = await response.json();
        const results = data.results;

        if (page === 1) {
            resultsContainer.innerHTML = "";
        }

        if (results.length === 0 && page === 1) {
            resultsContainer.innerHTML = "<p style='text-align: center; width: 100%; padding: 20px; color: #666;'>No results found. Try a different search term.</p>";
            showMoreBtn.style.display = "none";
            return;
        }

        results.forEach((result) => {
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add("search-result");
            
            // Create link wrapper for the image
            const imageLink = document.createElement('a');
            imageLink.href = result.links.html;
            imageLink.setAttribute("target", "_blank");
            imageLink.setAttribute("rel", "noopener noreferrer");
            
            const image = document.createElement('img');
            image.src = result.urls.small;
            image.alt = result.alt_description || "Unsplash image";
            
            imageLink.appendChild(image);
            
            const imageInfo = document.createElement('div');
            imageInfo.classList.add('image-info');
            
            const title = document.createElement('h3');
            title.textContent = result.alt_description || "Untitled Image";
            
            const author = document.createElement('p');
            author.textContent = `By ${result.user.name || "Unknown"}`;
            
            // Remove view button
            
            // Create a proper download button
            const downloadLink = document.createElement("a");
            downloadLink.href = result.urls.full;
            downloadLink.textContent = "Download";
            downloadLink.classList.add("download-btn");
            downloadLink.setAttribute("target", "_blank");
            downloadLink.setAttribute("rel", "noopener noreferrer");
            
            // Add proper filename with extension
            const filename = result.alt_description ? 
                result.alt_description.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg' : 
                'unsplash_image_' + result.id + '.jpg';
            
            downloadLink.onclick = (e) => {
                e.preventDefault();
                downloadImage(result.urls.full, filename);
            };

            imageInfo.appendChild(title);
            imageInfo.appendChild(author);
            imageInfo.appendChild(downloadLink);
            
            imageWrapper.appendChild(imageLink);
            imageWrapper.appendChild(imageInfo);
            resultsContainer.appendChild(imageWrapper);
        });

        if (results.length > 0) {
            showMoreBtn.style.display = "block";
        } else {
            showMoreBtn.style.display = "none";
        }
        
    } catch (error) {
        console.error("Error fetching images:", error);
        resultsContainer.innerHTML = "<p style='text-align: center; width: 100%; padding: 20px; color: #666;'>Something went wrong. Please try again later.</p>";
    }
}

// Function to properly download images with correct file type
async function downloadImage(url, filename) {
    try {
        // Show loading indicator on button
        const loadingIndicator = document.createElement('div');
        loadingIndicator.classList.add('loading-indicator');
        loadingIndicator.textContent = 'Downloading...';
        document.body.appendChild(loadingIndicator);
        
        // Fetch the image as a blob
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element for downloading
        const downloadAnchor = document.createElement('a');
        downloadAnchor.style.display = 'none';
        downloadAnchor.href = blobUrl;
        downloadAnchor.download = filename;
        
        // Append to document, trigger click, and clean up
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        
        // Clean up
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(downloadAnchor);
        document.body.removeChild(loadingIndicator);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
}

// Event Listeners
searchForm.addEventListener("submit", (e) => {
    page = 1;
    searchImages(e);
});

popularTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = tag.textContent;
        page = 1;
        searchImages();
    });
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});

// Create scroll to top button function
function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-top-btn';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.setAttribute('title', 'Scroll to top');
    document.body.appendChild(scrollButton);
    
    // Initially hide the button
    scrollButton.style.display = 'none';
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Set the current year in the footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Initialize the app with placeholder content
displayPlaceholderContent();

// Create the scroll to top button
createScrollToTopButton();
