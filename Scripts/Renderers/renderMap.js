import { setupMapSizing } from "../Utils/mapSizing.js";
import { setupTooltipInteractions } from "../Utils/tooltipUtils.js";
import { createDropdown } from "../Utils/dropdownUtils.js";

let isMapRendered = false;

// Define an array of six different orange colors
const orangeColors = [
  "#FFCC99", // Light orange
  "#FFB266", // Orange 1
  "#FF9933", // Orange 2
  "#FF8000", // Orange 3
  "#FF6600", // Orange 4
  "#FF4500", // Dark orange
];

// Function to filter out unwanted area names
function filterChartData(chartData) {
  const excludedAreaNames = ["London", "Lambeth", "England"];
  return chartData.filter(
    (entry) => !excludedAreaNames.includes(entry.AreaName)
  );
}

export function renderMap(containerId, geoJsonFilePath, mapType, chartData) {
  const mapContainer = document.getElementById(containerId);

  if (!mapContainer) {
    console.error(`Map container with ID ${containerId} not found`);
    return;
  }

  // Filter the chart data to exclude specific areas
  const filteredChartData = filterChartData(chartData);

  let svg, projection, path;

  function render() {
    const height = mapContainer.clientHeight * 0.8;

    const existingSvg = d3.select(mapContainer).select("svg");
    if (!existingSvg.empty()) {
      existingSvg.remove();
      console.log("Existing SVG removed");
      isMapRendered = false;
    }

    projection = d3.geoMercator().scale(1).translate([0, 0]);

    d3.json(geoJsonFilePath)
      .then((data) => {
        // First create the dropdown
        createDropdown(mapContainer, filteredChartData, mapType);

        // Then set up the map sizing and projection
        const {
          widthScale,
          height,
          projection: updatedProjection,
          path,
        } = setupMapSizing(mapContainer, data, projection);
        projection = updatedProjection;

        // Append the SVG after the dropdown
        svg = d3
          .select(mapContainer)
          .append("svg")
          .attr("width", widthScale)
          .attr("height", height)
          .attr("viewBox", `0 0 ${widthScale} ${height}`);

        svg
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "orange")
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .append("title")
          .text((d) => d.properties.WARD_NAME);

        // Set up tooltip interactions
        setupTooltipInteractions(svg, filteredChartData, mapType);

        // Handle the dropdown change event
        const dropdown = document.getElementById("data-dropdown");
        if (dropdown) {
          dropdown.addEventListener("change", function () {
            const selectedKey = this.value;
            console.log("Selected Key:", selectedKey);

            filteredChartData.forEach((entry) => {
              const value = entry[selectedKey];
              if (value !== undefined) {
                let colorIndex = Math.floor(
                  value / (100 / orangeColors.length)
                );
                colorIndex = Math.max(
                  0,
                  Math.min(colorIndex, orangeColors.length - 1)
                );
                console.log(
                  `${entry.AreaName}, ${selectedKey}, ${value}, ${orangeColors[colorIndex]}`
                );
              }
            });
          });

          // Log the initial selected key and its value on page load
          const initialSelectedKey = dropdown.value;
          console.log("Initial Selected Key:", initialSelectedKey);

          // Log for each entry
          filteredChartData.forEach((entry) => {
            const initialValue = entry[initialSelectedKey];
            if (initialValue !== undefined) {
              let colorIndex = Math.floor(
                initialValue / (100 / orangeColors.length)
              );
              colorIndex = Math.max(
                0,
                Math.min(colorIndex, orangeColors.length - 1)
              );

              console.log(
                `${entry.AreaName}, ${initialSelectedKey}, ${initialValue}, ${orangeColors[colorIndex]}`
              );
            }
          });
        } else {
          console.warn("Dropdown with ID 'data-dropdown' not found");
        }

        isMapRendered = true;
      })
      .catch((error) => {
        console.error("Error loading GeoJSON data:", error);
      });
  }

  render();

  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isMapRendered) {
        d3.select(mapContainer).select("svg").remove();
        isMapRendered = false;
      }
      render();
    }, 200);
  }

  window.addEventListener("resize", onResize);
}
