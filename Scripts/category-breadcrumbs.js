// Function to parse CSV data
function parseCSV(csv, categoryParam) {
  const rows = csv.split("\n");
  const headers = rows[0].split(",");
  let categoryData = {};

  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(",");
    if (rowData[1] === categoryParam) {
      // Check if Category-Name matches categoryParam
      headers.forEach((header, index) => {
        categoryData[header] = rowData[index];
      });
      break; // Exit loop after finding the matching category
    }
  }

  return categoryData;
}

// Function to fetch data from CSV file
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.text();
  return data;
}

// Function to get URL parameter
function getUrlParameter(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Get current category from URL
var currentCategory = getUrlParameter("category");

// Fetch CSV data and parse
async function fetchAndPopulateBreadcrumb() {
  const csvData = await fetchData("/Content/Category-Database.csv");
  const categoryInfo = parseCSV(csvData, currentCategory);

  // Update breadcrumb link with correct ambition ID
  const ambitionId = categoryInfo["Ambition-ID"];
  const ambitionLink = document.getElementById("ambitionLink");
  ambitionLink.href = `/ambitions.html?ambition=${ambitionId}`;
  ambitionLink.innerText = `Ambition ${ambitionId}`;

  // Update category title (you might want to handle cases when categoryInfo["Category-Name"] is not available)
  document.getElementById("categoryTitle").innerText =
    categoryInfo["Category-Name"];

  // Console logs
  console.log("Current Category:", categoryInfo["Category-Name"]);
  console.log("Current Ambition:", ambitionId);
  console.log("Current Category-ID:", categoryInfo["Category-ID"]);
}

fetchAndPopulateBreadcrumb();
