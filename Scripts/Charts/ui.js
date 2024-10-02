import { getCategoryById, getChartsByCategoryId } from "../Categories/data.js";
import { renderMap } from "../Renderers/renderMap.js";
import { renderMapBar } from "../Renderers/renderMapBar.js";
import { renderMapLine } from "../Renderers/renderMapLine.js";

/**
 * Update the UI with the chart metadata and display category.
 * @param {Object} chartMetadata - The metadata for the chart.
 */
export async function updateChartUI(chartMetadata) {
  const chartContainer = document.querySelector(".chart-container");
  const chartTitle = document.querySelector(".chart-container h1");
  const mapTitle = document.querySelector(".map-container h1");
  const tableCommentary = document.getElementById("table-commentary");
  const pageCommentary = document.getElementById("page-commentary");
  const wardMapButton = document.getElementById("ward-map-button");
  const chartButton = document.getElementById("chart-button");
  const previousButton = document.getElementById("previous-chart");
  const nextButton = document.getElementById("next-chart");
  const commentaryContainer = document.getElementById("commentary");
  const mapContainer = document.querySelector(".map-container");
  const wardChartContainer = document.querySelector(".ward-chart");
  const backToChartButton = document.getElementById("back-to-chart-button");
  const mapSvgContainer = document.getElementById("map-container-svg"); // Container for the ward map
  const categoryContainer = document.getElementById("category-container"); // Assuming a container to display the category

  if (chartMetadata) {
    // Update chart title and page title
    const titleText = chartMetadata["Chart-Name"];
    chartTitle.textContent = titleText;
    mapTitle.textContent = titleText;
    document.title = `Chart | ${chartMetadata["Chart-Name"]}`; // Set the HTML page title

    // Update commentaries
    tableCommentary.textContent = chartMetadata["Table Commentary"];
    pageCommentary.textContent = chartMetadata["Page Commentary"];

    // Fetch and display the category name
    const categoryId = chartMetadata["Category-ID"]; // Assuming category ID is part of the chart metadata
    if (categoryId) {
      try {
        const categoryData = await getCategoryById(categoryId);
        if (categoryData) {
          // Create the anchor element
          const categoryLink = document.createElement("a");
          categoryLink.href = `/categories.html?id=${categoryId}`; // URL for the category page
          categoryLink.style.textDecoration = "none"; // Optional: remove underline for the link

          // Create the button element
          const categoryButton = document.createElement("button");
          categoryButton.textContent = categoryData.name; // Set the button text to the category name
          categoryButton.style.cursor = "pointer"; // Optional: make the button look clickable

          // Append the button inside the anchor
          categoryLink.appendChild(categoryButton);

          // Clear the existing content in the category container and append the link
          categoryContainer.innerHTML = "";
          categoryContainer.appendChild(categoryLink);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

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

    // Inside the wardMapButton event listener
    wardMapButton.addEventListener("click", async () => {
      // Hide chart and commentary containers
      chartContainer.style.display = "none";
      commentaryContainer.style.display = "none";
      // Show the map container
      mapContainer.style.display = "block";

      // Step 1: Get the file path for the ward map
      const geoJsonFilePath = "Data/Maps/lambeth-ward-map.geojson"; // Adjust this path if necessary

      // Step 2: Get the file path for the ward chart data
      const filePath = chartMetadata["File-Path"];
      const fullPath = `Data/Charts-JSON/${filePath}`;

      try {
        // Fetch the ward chart data from the JSON file
        const response = await fetch(fullPath);
        const chartData = await response.json();

        // Step 3: Check the Map-Type and render the ward map using renderMap
        const mapType = chartMetadata["Map-Type"];
        renderMap(mapSvgContainer.id, geoJsonFilePath, mapType, chartData); // Call renderMap to display the map

        // Clear the previous chart before rendering a new one
        const wardChartContainerId = "ward-chart"; // Assuming this is the container ID
        d3.select(`#${wardChartContainerId}`).html("");

        if (mapType === "bar") {
          renderMapBar(wardChartContainerId, chartData);
        } else if (mapType === "line") {
          renderMapLine(wardChartContainerId, chartData);
        } else {
          console.error("Unknown Map-Type:", mapType);
        }
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    });

    // Add event listener to the Back to Chart button
    chartButton.addEventListener("click", () => {
      // Hide the map container
      mapContainer.style.display = "none";
      // Show chart and commentary containers
      chartContainer.style.display = "block";
      commentaryContainer.style.display = "block";
    });
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
