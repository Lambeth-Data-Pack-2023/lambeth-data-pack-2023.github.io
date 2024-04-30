let currentAmbitionIndex = 0;
let ambitions = [];

// Function to fetch CSV data
async function fetchCsvData() {
  const response = await fetch("/Content/Category-Database.csv");
  const csvData = await response.text();
  return Papa.parse(csvData, { header: true }).data;
}

// Function to generate menu items
async function generateMenu() {
  const menuItems = document.getElementById("menuItems");
  menuItems.innerHTML = ""; // Clear previous menu items

  const csvData = await fetchCsvData();

  // Group categories by ambition
  ambitions = csvData.reduce((acc, row) => {
    const ambitionId = row["Ambition-ID"];
    acc[ambitionId] = acc[ambitionId] || [];
    acc[ambitionId].push({
      name: row["Category-Name"],
      id: row["Category-ID"],
    });
    return acc;
  }, {});

  // Get the ambition from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const ambitionParam = urlParams.get("ambition");
  if (ambitionParam && ambitions[ambitionParam]) {
    currentAmbitionIndex = Object.keys(ambitions).indexOf(ambitionParam);
  }

  // Display the ambition
  displayAmbition(currentAmbitionIndex);
}

// Function to display an ambition by index
function displayAmbition(index) {
  const menuItems = document.getElementById("menuItems");
  menuItems.innerHTML = ""; // Clear previous menu items

  const menuAmbitionId = Object.keys(ambitions)[index];
  const menuItem = document.createElement("div");
  menuItem.classList.add("menu-content");

  const h2 = document.createElement("h2");
  h2.textContent = `Ambition ${menuAmbitionId}`;
  menuItem.appendChild(h2);

  const ul = document.createElement("ul");
  ambitions[menuAmbitionId].forEach((category) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `/categories.html?category=${encodeURIComponent(category.name)}`; // Updated href with category name
    const button = document.createElement("button");
    button.textContent = category.name;
    a.appendChild(button);
    li.appendChild(a);
    ul.appendChild(li);
  });
  menuItem.appendChild(ul);
  menuItems.appendChild(menuItem);
}

// Function to display previous ambition
function showPreviousMenu() {
  currentAmbitionIndex =
    (currentAmbitionIndex - 1 + Object.keys(ambitions).length) %
    Object.keys(ambitions).length;
  updatePageUrl();
}

// Function to display next ambition
function showNextMenu() {
  currentAmbitionIndex =
    (currentAmbitionIndex + 1) % Object.keys(ambitions).length;
  updatePageUrl();
}

// Function to update the page URL and reload the page
function updatePageUrl() {
  const ambitionParam = Object.keys(ambitions)[currentAmbitionIndex];
  window.location.href = `/ambitions.html?ambition=${ambitionParam}`;
}

// Call the function to generate menu items
generateMenu();
