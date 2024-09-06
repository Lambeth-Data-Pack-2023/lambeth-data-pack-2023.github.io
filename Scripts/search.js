import { fetchCSV } from "./dataLoader.js";

/**
 * Initializes the search functionality.
 * Sets up event listeners for input in the search field and document clicks.
 */
function initSearch() {
  const searchInput = document.querySelector(".searchInput");
  const resultsContainer = document.querySelector(".searchResults");

  // Set up event listener for real-time search as the user types
  searchInput.addEventListener("input", handleSearch);

  // Set up event listener to hide search results when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !searchInput.contains(event.target) &&
      !resultsContainer.contains(event.target)
    ) {
      resultsContainer.style.display = "none";
    }
  });

  // Show search results container when search input is focused
  searchInput.addEventListener("focus", () => {
    const searchInputValue = searchInput.value.trim();
    if (searchInputValue !== "") {
      resultsContainer.style.display = "flex";
    }
  });
}

// Handles the search action by fetching, filtering, and displaying results.
async function handleSearch() {
  const searchInput = getSearchInput();
  const resultsContainer = document.querySelector(".searchResults");

  if (searchInput === "") {
    resultsContainer.style.display = "none"; // Hide results container if input is empty
    return;
  }

  const charts = await fetchChartData();
  const results = filterCharts(charts, searchInput);
  displaySearchResults(results);

  // Ensure results container is shown
  resultsContainer.style.display = "flex";
}

// Retrieves the user's search input.
function getSearchInput() {
  return document.querySelector(".searchInput").value.trim().toLowerCase();
}

// Fetches the chart data from the CSV file.
async function fetchChartData() {
  return await fetchCSV("Data/Content/Chart-Database.csv");
}

// Filters the chart data based on the user's search input.
function filterCharts(charts, searchInput) {
  return charts.filter((chart) =>
    chart["Chart-Name"].toLowerCase().includes(searchInput)
  );
}

// Displays the search results in the results container.
function displaySearchResults(results) {
  const resultsContainer = document.querySelector(".searchResults");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (results.length === 0 && getSearchInput() !== "") {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  } else {
    results.forEach((result) => {
      const resultItem = document.createElement("a");
      resultItem.href = `/charts.html?id=${result["Chart-ID"]}`; // Link to the chart page with the chart ID
      resultItem.textContent = result["Chart-Name"]; // Display the chart name
      resultItem.classList.add("resultItem");
      resultsContainer.appendChild(resultItem);
    });
  }
}

// Initialize search when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initSearch);
