import { setupChart, addXAxis, addYAxis, addYAxisLabel } from "./chartUtils.js";

export function renderBarChart(data, container, chartMetadata) {
  console.log("Creating bar chart...");

  // Extract metadata
  const xKey = chartMetadata["X-Axis-Key"];
  const yKey = chartMetadata["Y-Axis-Key"];
  const yLabel = chartMetadata["Y-Label"];

  // Setup chart using utility function
  const { width, height, margin, svg, xScale, yScale } = setupChart(
    container,
    chartMetadata,
    d3.scaleBand // Specify the xScale type as scaleBand for bar chart
  );

  // Set the domains for the scales
  xScale.domain(data.map((d) => d[xKey])).paddingInner(0.1); // Add padding between the bars

  yScale.domain([0, d3.max(data, (d) => +d[yKey])]).nice();

  // Add the X axis
  addXAxis(svg, xScale, height);

  // Add the Y axis
  addYAxis(svg, yScale);

  // Add Y axis label
  addYAxisLabel(svg, yLabel, margin, height);

  // Add bars with interactive effects
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d[xKey]))
    .attr("y", (d) => yScale(+d[yKey]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(+d[yKey]))
    .attr("fill", "steelblue")
    .style("cursor", "pointer") // Set cursor to pointer
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "orange"); // Change color on hover
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("fill", "steelblue"); // Revert color when not hovered
    })
    .append("title")
    .text((d) => `${d[xKey]}: ${d[yKey]}`);

  console.log("Bar chart created successfully.");
}
