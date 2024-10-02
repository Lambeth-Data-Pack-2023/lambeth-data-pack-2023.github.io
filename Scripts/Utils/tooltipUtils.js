// Scripts/Utils/tooltipUtils.js

// Function to create the tooltip content based on ward data
export function createTooltipContent(wardName, details, mapType, selectedKey) {
  let titleText = `Ward: ${wardName}\n`;

  if (details.length > 0) {
    if (mapType === "bar") {
      const value = details[0][selectedKey]; // Get the value for the selected key
      titleText += `${selectedKey}: ${value}\n`;
    } else if (mapType === "line") {
      details.forEach((detail) => {
        Object.entries(detail).forEach(([key, value]) => {
          titleText += `${key}: ${value}\n`;
        });
      });
    }
  } else {
    titleText += "No Data"; // Fallback if no details found
  }

  return titleText;
}

// Function to set up tooltip interactions on paths
export function setupTooltipInteractions(svg, chartData, mapType) {
  svg
    .selectAll("path")
    .on("mouseover", function (event, d) {
      const selectedKey = d3.select("#data-dropdown").property("value");
      const details = getFilteredDetails(d, chartData, mapType, selectedKey);

      const titleText = createTooltipContent(
        d.properties.WARD_NAME,
        details,
        mapType,
        selectedKey
      );

      // Update the title element to show ward details
      d3.select(this).select("title").text(titleText);
    })
    .on("mouseout", function () {
      // Restore the original title when mouse out
      d3.select(this).select("title").text(d.properties.WARD_NAME);
    });
}

// Helper function to filter data based on the selected map type and ward name
function getFilteredDetails(d, chartData, mapType, selectedKey) {
  let details;

  if (mapType === "bar") {
    details = chartData.filter(
      (entry) =>
        entry["AreaName"] === d.properties.WARD_NAME &&
        entry[selectedKey] !== undefined
    );
  } else if (mapType === "line") {
    const selectedTimePeriod = d3.select("#data-dropdown").property("value");
    details = chartData.filter(
      (entry) =>
        entry["AreaName"] === d.properties.WARD_NAME &&
        entry["Time period"] === selectedTimePeriod
    );
  }

  return details;
}
