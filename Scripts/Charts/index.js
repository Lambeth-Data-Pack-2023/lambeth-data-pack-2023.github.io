import { fetchChartMetadata, fetchChartData } from "./data.js";
import { updateChartUI, showError } from "./ui.js";
import { renderBarChart } from "../Renderers/barChart.js";
import { renderLineChart } from "../Renderers/lineChart.js";
import { renderGroupedBarChart } from "../Renderers/groupedBar.js";
import { renderMultiGroupedBarChart } from "../Renderers/multiGroupedBar.js";
import { renderSurveyBarChart } from "../Renderers/surveyBarChart.js";

document.addEventListener("DOMContentLoaded", async () => {
  const chartId = getChartId();
  console.log(`Chart ID: ${chartId}`); // Log the chart ID

  try {
    console.log("Fetching chart metadata...");
    const chartMetadata = await fetchChartMetadata(chartId);
    console.log("Chart Metadata:", chartMetadata); // Log the fetched metadata

    if (!chartMetadata) {
      console.error("Chart metadata not found.");
      showError("Chart metadata not found.");
      return;
    }

    updateChartUI(chartMetadata);

    console.log("Fetching chart data from:", chartMetadata["File-Path"]);
    const chartData = await fetchChartData(chartMetadata["File-Path"]);
    console.log("Chart Data:", chartData); // Log the fetched data

    const chartType = chartMetadata["Chart-Type"];
    console.log(`Rendering chart of type: ${chartType}`); // Log the chart type
    const chartContainer = document.querySelector(".chart-container");

    switch (chartType) {
      case "bar":
        renderBarChart(chartData, chartContainer, chartMetadata);
        console.log("Bar chart rendered successfully."); // Success log
        break;
      case "line":
        renderLineChart(chartData, chartContainer, chartMetadata);
        console.log("Line chart rendered successfully."); // Success log
        break;
      case "grouped-bar":
        renderGroupedBarChart(chartData, chartContainer, chartMetadata);
        console.log("Grouped bar chart rendered successfully."); // Success log
        break;
      case "multi-grouped-bar":
        renderMultiGroupedBarChart(chartData, chartContainer, chartMetadata);
        console.log("Multi Grouped bar chart rendered successfully."); // Success log
        break;
      case "survey-bar":
        renderSurveyBarChart(chartData, chartContainer, chartMetadata);
        break;
      default:
        const errorMsg = `Unsupported chart type: ${chartType}`;
        console.error(errorMsg);
        showError(errorMsg);
    }
  } catch (error) {
    console.error("Error occurred during chart rendering:", error);
    showError("Failed to load chart data. Please try again later.");
  }
});

/**
 * Extracts the chart ID from the URL or another source.
 * @returns {string} The chart ID.
 */
function getChartId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
