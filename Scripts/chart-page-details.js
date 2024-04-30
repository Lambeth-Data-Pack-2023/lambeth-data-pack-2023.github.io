// Define global variables
const baseFilePath = "/Python.JS Scripts/Clean Data/";
let urlParams = new URLSearchParams(window.location.search);

// Function to log current page details
function logPageDetails() {
  const chartName = urlParams.get("chart");
  const chart = getChartDetails(chartName);

  if (!chart) {
    console.error("Chart not found.");
    return;
  }

  const { categoryName, categoryID, ambitionID, chartType, filePath } = chart;
  const fullFilePath = baseFilePath + filePath;

  setPageTitle(chartName);
  logChartDetails(chart);
  fetchJSONData(fullFilePath);
  updateBreadcrumbs(ambitionID, categoryName);
  updateChartName(chartName);
}

// Function to set page title
function setPageTitle(chartName) {
  const pageTitle = `Lambeth | ${chartName}`;
  document.title = pageTitle;
}

// Function to log chart details
function logChartDetails(chart) {
  console.log("Visual-Chart-Name:", chart.chartName);
  console.log("Visual-Chart-ID:", chart.chartID);
  console.log("Category-Name:", chart.categoryName);
  console.log("Category-ID:", chart.categoryID);
  console.log("Full-File-Path:", chart.fullFilePath);
  console.log("Chart-Type:", chart.chartType);
}

// Function to fetch JSON data
function fetchJSONData(fullFilePath) {
  fetch(fullFilePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("JSON Data from File:", data);
      // Do something with the data if needed
    })
    .catch((error) => {
      console.error("Error fetching JSON data:", error);
    });
}

// Function to update breadcrumbs
function updateBreadcrumbs(ambitionID, categoryName) {
  const ambitionBreadcrumb = document.getElementById("ambitionBreadcrumb");
  const categoryBreadcrumb = document.getElementById("categoryBreadcrumb");
  ambitionBreadcrumb.innerHTML = `<a href="/ambitions.html?ambition=${ambitionID}">Ambition ${ambitionID}</a> / `;
  categoryBreadcrumb.innerHTML = `<a href="/categories.html?category=${categoryName}">${categoryName}</a>`;
}

// Function to update chart name
function updateChartName(chartName) {
  const h2ChartName = document.getElementById("chartName");
  h2ChartName.textContent = chartName;
}

// Function to get chart details by chart name
function getChartDetails(chartName) {
  const chart = visualChartData.find(
    (chart) => chart["Visual-Chart-Name"] === chartName
  );

  if (!chart) return null;

  const categoryID = chart["Category-ID"];
  const category = categoryData.find(
    (category) => category["Category-ID"] === categoryID
  );

  return {
    chartName: chartName,
    categoryName: category ? category["Category-Name"] : "",
    categoryID: categoryID,
    chartID: chart["Visual-Chart-ID"],
    ambitionID: chart["Ambition-ID"],
    filePath: chart["File-Path"],
    chartType: chart["Chart-Type"],
    fullFilePath: baseFilePath + chart["File-Path"],
  };
}
