let visualChartData, categoryData;

// Function to get category name by chart name
function getCategoryNameByChartName(chartName) {
  const chart = visualChartData.find(
    (chart) => chart["Visual-Chart-Name"] === chartName
  );
  if (chart) {
    const categoryID = chart["Category-ID"];
    const category = categoryData.find(
      (category) => category["Category-ID"] === categoryID
    );
    return category ? category["Category-Name"] : "";
  }
  return "";
}

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

  // Get category name from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const chartName = urlParams.get("chart");
  const categoryName = getCategoryNameByChartName(chartName);

  // Find the index of the current category
  const currentIndex = categoryData.findIndex(
    (category) => category["Category-Name"] === categoryName
  );

  // Set currentCategoryIndex to the index of the current category
  if (currentIndex !== -1) {
    currentCategoryIndex = currentIndex;
  }

  generateMenuItemsForCategory(
    visualChartData,
    categoryData,
    currentCategoryIndex
  );
}

// Function calls
fetchDataAndGenerateMenuItems();
