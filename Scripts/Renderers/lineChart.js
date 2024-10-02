import { setupChart, addXAxis, addYAxis, addYAxisLabel } from "./chartUtils.js";

/**
 * Renders a line chart using D3.js.
 * @param {Array<Object>} data - The data to be visualized.
 * @param {HTMLElement} container - The DOM element to render the chart into.
 * @param {Object} chartData - The metadata containing chart configurations.
 */
export function renderLineChart(data, container, chartData) {
  /**
   * Inner function to render the line chart. This function is invoked both
   * initially and upon window resize to ensure the chart is responsive.
   */
  const renderChart = () => {
    // Clear any existing SVG to prevent overlap of multiple charts
    d3.select(container).select("svg").remove();

    // Setup the chart's dimensions, scales, and SVG container using a utility function
    const { width, height, margin, svg, xScale, yScale } = setupChart(
      container,
      chartData,
      d3.scaleBand // Specify the xScale type as scaleBand for the line chart
    );

    // Append a background rectangle to the SVG
    svg
      .append("rect")
      .attr("width", width) // Set the width of the background
      .attr("height", height) // Set the height of the background
      .attr("fill", "#fff"); // Set the background color (e.g., light grey)

    // Add horizontal grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width) // Extend lines to span the width of the chart
          .tickFormat("") // Hide the tick labels
      )
      .selectAll(".tick line")
      .attr("stroke", "#ddd") // Color of the grid lines
      .attr("stroke-width", 1); // Width of the grid lines

    // Extract key metadata for configuring the axes and labels
    const xAxisKey = chartData["X-Axis-Key"]; // Key for x-axis values in the data
    const yAxisKey = chartData["Y-Axis-Key"]; // Key for y-axis values in the data
    const thirdVarKey = chartData["Third-Var-Key"]; // Key for the grouping variable
    const yLabel = chartData["Y-Label"]; // Label for the y-axis
    const mainLocations = ["London", "Lambeth", "England"]; // Locations to focus on

    // Filter the data to include only the main locations specified
    const filteredData = data.filter((d) =>
      mainLocations.includes(d[thirdVarKey])
    );

    // Sort the filtered data by the x-axis key for proper line rendering
    filteredData.sort((a, b) => a[xAxisKey].localeCompare(b[xAxisKey]));

    // Group the data by the third variable (e.g., location)
    const groupedData = d3.group(filteredData, (d) => d[thirdVarKey]);

    // Set the domain of the xScale based on the x-axis key values in the filtered data
    xScale.domain(filteredData.map((d) => d[xAxisKey]));

    // Set the domain of the yScale from 0 to the maximum y-axis value in the filtered data
    yScale.domain([0, d3.max(filteredData, (d) => +d[yAxisKey])]).nice();

    // Add the X and Y axes to the chart using utility functions
    addXAxis(svg, xScale, height);
    addYAxis(svg, yScale);
    addYAxisLabel(svg, yLabel, margin, height); // Add y-axis label

    // Create a color scale to assign distinct colors to each group (location)
    const colorScale = d3
      .scaleOrdinal()
      .domain(mainLocations)
      .range(d3.schemeCategory10);

    // Iterate over each group (location) to draw lines and points
    groupedData.forEach((groupData, location) => {
      const group = svg.append("g"); // Create a new group element for each location

      // Draw the line path for the current group (location)
      const path = group
        .append("path")
        .datum(groupData) // Bind the data for the current group
        .attr("fill", "none") // No fill for line paths
        .attr("stroke", colorScale(location)) // Set the stroke color based on location
        .attr("stroke-width", 4) // Set the stroke width of the line
        .attr(
          "d",
          d3
            .line() // Create a line generator function
            .x((d) => xScale(d[xAxisKey]) + xScale.bandwidth() / 2) // Set x position based on x-axis key
            .y((d) => yScale(+d[yAxisKey])) // Set y position based on y-axis key
        );

      // Line animation (drawing effect)
      const totalLength = path.node().getTotalLength(); // Get the length of the path
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength) // Create dashed array based on total length
        .attr("stroke-dashoffset", totalLength) // Offset to make the line invisible initially
        .transition() // Apply transition
        .duration(2000) // Duration of the line drawing
        .ease(d3.easeLinear) // Linear easing function
        .attr("stroke-dashoffset", 0); // Set the dash offset to 0 to reveal the line

      // Add data points (circles) on the line
      const circles = group
        .selectAll("circle")
        .data(groupData) // Bind the data for the current group
        .enter()
        .append("circle") // Append circle elements
        .attr("cx", (d) => xScale(d[xAxisKey]) + xScale.bandwidth() / 2) // Set x position
        .attr("cy", (d) => yScale(+d[yAxisKey])) // Set y position
        .attr("r", 0) // Start with radius 0 for animation
        .attr("fill", colorScale(location)) // Set fill color based on location
        .style("cursor", "pointer") // Set cursor to pointer
        .style("stroke", "black") // Set the border color to black
        .style("stroke-width", 2); // Set the initial border width

      // Animate circles (grow from radius 0 to their actual size)
      circles
        .transition()
        .delay((d, i) => i * 200) // Delay each circle slightly for a staggered effect
        .duration(1000) // Duration for the circle animation
        .attr("r", 6); // Set the final radius

      // Add interaction for hover effect
      circles
        .on("mouseover", function () {
          d3.select(this)
            .transition() // Smooth transition
            .duration(200) // Transition duration
            .attr("r", 8) // Increase the radius slightly on hover
            .style("stroke-width", 4); // Make the border thicker on hover
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition() // Smooth transition
            .duration(200) // Transition duration
            .attr("r", 6) // Return the radius to the original size
            .style("stroke-width", 2); // Return the border width to the original size
        })
        .append("title") // Add a title for tooltips
        .text((d) => {
          const value = +d[yAxisKey];
          return `${location}: ${value.toLocaleString(undefined, {
            minimumFractionDigits: value % 1 === 0 ? 0 : 1,
            maximumFractionDigits: 1,
          })}`;
        });
    });
  };

  // Initial rendering of the chart
  renderChart();

  // Add a resize listener to re-render the chart on window resize, ensuring responsiveness
  window.addEventListener("resize", renderChart);
}
