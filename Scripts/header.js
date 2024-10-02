// header.js

/**
 * Populates the header with the menu icon, search input, and search button.
 */
function displayHeader() {
  const header = document.querySelector("header");

  header.innerHTML = `
    <button class="toggleButton" data-target="menu">
      <i class="fa fa-bars"></i>
    </button>
    <a href="index.html">
      <img src="Images/Lambeth-logo-white.png" alt="Lambeth Logo" class="logo">
    </a>
    <div class="searchContainer">
      <input type="text" class="searchInput" placeholder="Search for charts...">
      <button class="searchButton">
        <i class="fa fa-search"></i>
      </button>
    </div>
    <div class="searchResults"></div>
  `;
}

/**
 * Initializes the header by displaying it and setting up necessary event listeners.
 */
function initHeader() {
  displayHeader();
}

// Call the function to populate the header when the page loads
document.addEventListener("DOMContentLoaded", initHeader);
