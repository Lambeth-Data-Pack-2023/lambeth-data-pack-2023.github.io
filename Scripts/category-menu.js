// Track the current category index
let currentCategoryIndex = 0;

// Function to generate menu items for a specific category
function generateMenuItemsForCategory(visualChartData, categoryData, index) {
  const menuContainer = document.getElementById("menuItems");
  menuContainer.innerHTML = ""; // Clear previous menu items

  const category = categoryData[index];
  const menuContentDiv = document.createElement("div");
  menuContentDiv.classList.add("menu-content");

  const categoryHeader = document.createElement("h2");
  categoryHeader.textContent = category ? category["Category-Name"] : ""; // Check if category exists
  menuContentDiv.appendChild(categoryHeader);

  const categoryCharts = category
    ? visualChartData.filter(
        (chart) => chart["Category-ID"] === category["Category-ID"]
      )
    : [];

  const chartList = document.createElement("ul");
  categoryCharts.forEach((chart) => {
    const chartItem = document.createElement("li");
    const chartLink = document.createElement("a");
    const chartButton = document.createElement("button");

    chartButton.textContent = chart["Visual-Chart-Name"];
    chartButton.onclick = () => {
      // Add onclick behavior if needed
    };
    chartLink.href = `charts.html?chart=${chart["Visual-Chart-Name"]}`; // Set the href attribute

    // Check if Chart-Displayed is equal to 'y', then append the check icon
    if (chart["Chart-Displayed"] === "y") {
      const checkIcon = document.createElement("i");
      checkIcon.classList.add("fa", "fa-check", "green");
      chartLink.appendChild(checkIcon);
    }

    chartLink.appendChild(chartButton); // Appending button tag inside anchor tag
    chartItem.appendChild(chartLink); // Appending anchor tag inside list item
    chartList.appendChild(chartItem);
  });

  menuContentDiv.appendChild(chartList); // Append the <ul> to the menu content div
  menuContainer.appendChild(menuContentDiv); // Append the menu content div to the container

  // Log page details after generating menu items
  logPageDetails();
}

// Function to navigate to the previous category
function showPreviousMenu() {
  const categoryDataLength = categoryData.length;
  currentCategoryIndex =
    (currentCategoryIndex - 1 + categoryDataLength) % categoryDataLength;
  updatePageUrl();
}

// Function to navigate to the next category
function showNextMenu() {
  const categoryDataLength = categoryData.length;
  currentCategoryIndex = (currentCategoryIndex + 1) % categoryDataLength;
  updatePageUrl();
}

// Function to update the page URL and reload the page
function updatePageUrl() {
  const categoryName = categoryData[currentCategoryIndex]["Category-Name"];
  window.location.href = `/categories.html?category=${encodeURIComponent(
    categoryName
  )}`;
}

let visualChartData, categoryData;

// Function to fetch and parse CSV data
async function fetchDataAndGenerateMenuItems() {
  const visualChartDataResponse = await fetch(
    "/Content/Chart-Visual-Database.csv"
  );
  const visualChartDataText = await visualChartDataResponse.text();
  visualChartData = Papa.parse(visualChartDataText, {
    header: true,
  }).data;

  const categoryDataResponse = await fetch("/Content/Category-Database.csv");
  const categoryDataText = await categoryDataResponse.text();
  categoryData = Papa.parse(categoryDataText, {
    header: true,
  }).data;

  // Find the index of the current category
  currentCategoryIndex = categoryData.findIndex(
    (category) => category["Category-Name"] === currentCategory
  );

  // Generate menu items for the current category
  generateMenuItemsForCategory(
    visualChartData,
    categoryData,
    currentCategoryIndex
  );
}

// Call the function to fetch and generate menu items
fetchDataAndGenerateMenuItems();
