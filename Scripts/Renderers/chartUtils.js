/**
 * Sets up the chart with the given parameters.
 * @param {HTMLElement} container - The container element for the chart.
 * @param {Object} chartData - The metadata for the chart.
 * @param {Function} xScaleType - The D3 scale type for the x-axis.
 * @returns {Object} - An object containing chart setup details like width, height, scales, and the SVG element.
 */
export function setupChart(container, chartData, xScaleType) {
  const margin = { top: 75, right: 30, bottom: 150, left: 75 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%") // Set SVG width to 100%
    .attr("height", "90%") // Set SVG height to 100%
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${
        height + margin.top + margin.bottom
      }`
    ) // Responsive SVG viewBox
    .attr("preserveAspectRatio", "xMidYMid meet") // Preserve aspect ratio and center SVG
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales
  const xScale = xScaleType().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);

  return { width, height, margin, svg, xScale, yScale };
}

/**
 * Adds the X-axis to the chart.
 * @param {Object} svg - The SVG element.
 * @param {Function} xScale - The D3 scale for the x-axis.
 * @param {number} height - The height of the chart.
 */
export function addXAxis(svg, xScale, height) {
  const xAxisGroup = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // Rotate X-axis labels to prevent overlap
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-45)") // Rotate by -45 degrees
    .style("text-anchor", "end") // Adjust the text anchor to end
    .attr("dx", "-0.5em") // Adjust horizontal offset
    .attr("dy", "0.5em"); // Adjust vertical offset
}
/**
 * Adds the Y-axis to the chart.
 * @param {Object} svg - The SVG element.
 * @param {Function} yScale - The D3 scale for the y-axis.
 */
export function addYAxis(svg, yScale) {
  svg.append("g").call(d3.axisLeft(yScale));
}

/**
 * Adds the Y-axis label to the chart.
 * @param {Object} svg - The SVG element.
 * @param {string} yLabel - The label for the y-axis.
 * @param {Object} margin - The margin object containing margins for the chart.
 * @param {number} height - The height of the chart.
 */
export function addYAxisLabel(svg, yLabel, margin, height) {
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yLabel);
}
