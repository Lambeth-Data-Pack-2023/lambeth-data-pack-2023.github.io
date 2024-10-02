import { setupChart, addXAxis, addYAxis, addYAxisLabel } from "./chartUtils.js";

export function renderGroupedBarChart(data, container, chartMetadata) {
  console.log("Creating grouped bar chart...");

  // Extract metadata
  const xKey = chartMetadata["X-Axis-Key"];
  const yKey = chartMetadata["Y-Axis-Key"];
  const thirdKey = chartMetadata["Third-Var-Key"];
  const yLabel = chartMetadata["Y-Label"];
  const mainLocations = ["Lambeth", "London", "England"];

  // Setup chart using utility function
  const { width, height, margin, svg, xScale, yScale } = setupChart(
    container,
    chartMetadata,
    d3.scaleBand // Specify the xScale type as scaleBand for grouped bar chart
  );

  // Identify percentage keys for grouping
  const allKeys = Object.keys(data[0]);
  const percentageKeys = allKeys.filter((key) => key.endsWith("(%)"));

  // Filter data for main locations
  const filteredLocations = data.filter((item) =>
    mainLocations.includes(item[thirdKey])
  );

  // Format the data for grouped bars
  const chartDataFormatted = percentageKeys.map((key) => ({
    key,
    values: mainLocations.map((location) => {
      const locationData = filteredLocations.find(
        (item) => item[thirdKey] === location
      );
      return {
        location,
        value: locationData ? locationData[key] : 0,
      };
    }),
  }));

  // Set the domains for the scales
  xScale.domain(percentageKeys).paddingInner(0.2); // Add padding between groups
  yScale
    .domain([
      0,
      d3.max(chartDataFormatted, (d) => d3.max(d.values, (v) => +v.value)),
    ])
    .nice();

  // Add the X axis
  addXAxis(svg, xScale, height);

  // Add the Y axis
  addYAxis(svg, yScale);

  // Add Y axis label
  addYAxisLabel(svg, yLabel, margin, height);

  // Add horizontal grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .call(
      d3
        .axisLeft(yScale)
        .tickSize(-width) // Extend grid lines across the chart
        .tickFormat("") // Hide tick labels
    )
    .selectAll(".tick line")
    .attr("stroke", "#ddd") // Set grid line color
    .attr("stroke-width", 1); // Set grid line width

  // Color scale
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create groups for each percentage key
  const barGroups = svg
    .selectAll(".bar-group")
    .data(chartDataFormatted)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", (d) => `translate(${xScale(d.key)}, 0)`);

  // Add the bars with interactive effects and animation
  barGroups
    .selectAll(".bar")
    .data((d) => d.values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => i * (xScale.bandwidth() / mainLocations.length))
    .attr("y", height) // Start from the bottom
    .attr("width", xScale.bandwidth() / mainLocations.length)
    .attr("height", 0) // Initial height of 0
    .attr("fill", (d) => colorScale(d.location))
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", d3.rgb(colorScale(d.location)).brighter(1)); // Darken color on hover
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("fill", colorScale(d.location)); // Revert color when not hovered
    })
    .append("title")
    .text((d) => `${d.location}: ${d.value}%`);

  // Animate the bars to grow from 0 height to their actual value
  svg
    .selectAll(".bar")
    .transition() // Start the transition
    .duration(1000) // 1 second duration
    .attr("y", (d) => yScale(+d.value)) // Final y position
    .attr("height", (d) => height - yScale(+d.value)); // Final height based on data

  // Add a legend
  const legend = svg
    .selectAll(".legend")
    .data(mainLocations)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => d);

  console.log("Grouped bar chart created successfully.");
}
