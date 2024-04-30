// Function to display header
function displayHeader() {
  const header = document.querySelector("header");
  if (header) {
    header.innerHTML = `
            <a href="/index.html">
                <img class="logo" src="/Images/Lambeth-logo-white.png" alt="Lambeth Council logo"/>
            </a>
            <h1>Lambeth Data Packs 2024</h1>
            <div class="header-buttons">
              <input type="text" class="search-input" placeholder="Data Search...">
              <button class="search-btn"><i class="fa fa-search"></i></button>
            </div>
             <div class="search-suggestions"></div>
        `;
  } else {
    console.error("Header element not found.");
  }
}

// Function to fetch CSV data
async function fetchCSVData() {
  try {
    const response = await fetch("/Content/Chart-Visual-Database.csv");
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching CSV:", error.message);
    return null;
  }
}

// Function to parse CSV data
function parseCSVData(csv, columnName) {
  try {
    const parsedData = Papa.parse(csv, { header: true });
    if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
      console.error("Parsed CSV data is empty.");
      return [];
    }
    const columnData = parsedData.data.map((row) => row[columnName]);
    return columnData.filter((value) => value !== undefined); // Filter out undefined values
  } catch (error) {
    console.error("Error parsing CSV:", error.message);
    return [];
  }
}

// Function to display search suggestions
function displaySearchSuggestions(suggestions) {
  const suggestionsElement = document.querySelector(".search-suggestions");
  if (!suggestionsElement) {
    console.error("Search suggestions element not found.");
    return;
  }

  if (suggestions.length === 0) {
    suggestionsElement.innerHTML = ""; // Clear previous suggestions
    suggestionsElement.style.display = "none"; // Hide the search suggestions div
    return;
  }

  suggestionsElement.innerHTML = ""; // Clear previous suggestions

  suggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement("a");
    suggestionElement.textContent = suggestion;
    suggestionElement.href = `/charts.html?chart=${encodeURIComponent(
      suggestion
    )}`; // Encode suggestion for URL
    suggestionElement.classList.add("suggestion-link"); // Optional: Add a class for styling
    suggestionsElement.appendChild(suggestionElement);
  });

  suggestionsElement.style.display = "flex"; // Show the search suggestions div
}

// Function to handle input and display suggestions
async function handleInput() {
  try {
    const searchInput = document.querySelector(".search-input");
    const suggestionsElement = document.querySelector(".search-suggestions");

    if (!searchInput || !suggestionsElement) {
      console.error("Search input or suggestions element not found.");
      return;
    }

    const inputValue = searchInput.value.trim().toLowerCase();

    const csvData = await fetchCSVData();
    if (!csvData) {
      console.error("CSV data is empty or failed to fetch.");
      return;
    }

    const chartVisualNames = parseCSVData(csvData, "Visual-Chart-Name");

    if (!inputValue) {
      suggestionsElement.innerHTML = ""; // Clear suggestions if input is empty
      suggestionsElement.style.display = "none";
      return;
    }

    const suggestions = chartVisualNames.filter((name) =>
      name.toLowerCase().includes(inputValue)
    );

    displaySearchSuggestions(suggestions);
  } catch (error) {
    console.error("Error handling input:", error.message);
  }
}

// Function to handle clicks outside search suggestions
function handleOutsideClick(event) {
  const suggestionsElement = document.querySelector(".search-suggestions");
  if (suggestionsElement && !suggestionsElement.contains(event.target)) {
    suggestionsElement.innerHTML = ""; // Clear suggestions
  }
}

// Function to initialize
function initialize() {
  displayHeader();
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) {
    console.error("Search input element not found.");
    return;
  }
  searchInput.addEventListener("input", handleInput);

  // Add event listener to detect clicks outside search suggestions
  document.body.addEventListener("click", handleOutsideClick);
}

// Call initialize function when the page loads
window.addEventListener("load", initialize);
