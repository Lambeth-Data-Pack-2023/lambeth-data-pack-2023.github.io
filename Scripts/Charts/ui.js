/**
 * Update the UI with the chart metadata.
 * @param {Object} chartMetadata - The metadata for the chart.
 */
export function updateChartUI(chartMetadata) {
  const chartContainer = document.querySelector(".chart-container");
  const chartTitle = document.querySelector(".chart-container h1");
  const tableCommentary = document.getElementById("table-commentary");
  const pageCommentary = document.getElementById("page-commentary");
  const wardMapButton = document.getElementById("ward-map-button");
  const previousButton = document.getElementById("previous-chart");
  const nextButton = document.getElementById("next-chart");

  if (chartMetadata) {
    // Update chart title and page title
    const titleText = chartMetadata["Chart-Name"];
    chartTitle.textContent = titleText;
    document.title = `Chart | ${chartMetadata["Chart-Name"]}`; // Set the HTML page title

    // Update commentaries
    tableCommentary.textContent = chartMetadata["Table Commentary"];
    pageCommentary.textContent = chartMetadata["Page Commentary"];

    // Update map button visibility
    if (chartMetadata["Map-Type"] !== "N/A") {
      wardMapButton.style.display = "inline-block";
    } else {
      wardMapButton.style.display = "none";
    }

    // Get the current chart ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    let currentId = parseInt(urlParams.get("id"), 10);

    // Define first and last chart IDs
    const firstId = 1;
    const lastId = 95;

    // Calculate previous and next chart IDs
    let previousId = currentId - 1;
    let nextId = currentId + 1;

    // Prevent previousId from going below firstId
    if (previousId < firstId) {
      previousId = firstId;
    }

    // Prevent nextId from going above lastId
    if (nextId > lastId) {
      nextId = lastId;
    }

    // Update button URLs
    if (previousButton) {
      previousButton.href = `/charts.html?id=${previousId}`;
    }
    if (nextButton) {
      nextButton.href = `/charts.html?id=${nextId}`;
    }
  } else {
    // Handle chart not found
    chartTitle.textContent = "Chart Not Found";
    document.title = "Chart Not Found"; // Set the HTML page title
    tableCommentary.textContent = "";
    pageCommentary.textContent = "";
    wardMapButton.style.display = "none";

    // Disable or hide buttons if chart not found
    if (previousButton) {
      previousButton.style.display = "none";
    }
    if (nextButton) {
      nextButton.style.display = "none";
    }
  }
}

/**
 * Render an error message if the chart data fails to load.
 * @param {string} errorMessage - The error message to display.
 */
export function showError(errorMessage) {
  const chartContainer = document.querySelector(".chart-container");
  chartContainer.innerHTML = `<p class="error">${errorMessage}</p>`;
}
