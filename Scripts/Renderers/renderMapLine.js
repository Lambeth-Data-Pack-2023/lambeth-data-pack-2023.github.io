export function renderMapLine(containerId, chartData) {
  // Define AreaNames to exclude from the dropdown
  const excludedAreaNames = ["London", "Lambeth", "England"];

  // Extract all unique Area Names excluding the specified ones
  const uniqueAreaNames = Array.from(
    new Set(
      chartData
        .map((data) => data["AreaName"])
        .filter((areaName) => !excludedAreaNames.includes(areaName))
    )
  );

  // Extract all unique time periods from the dataset
  const uniqueTimePeriods = Array.from(
    new Set(chartData.map((data) => data["Time period"]))
  );

  // Log the unique values for debugging
  console.log("Unique Time Periods:", uniqueTimePeriods);
  console.log("Unique Area Names:", uniqueAreaNames);

  // Set dimensions for the SVG
  const margin = { top: 20, right: 30, bottom: 50, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create a container for the dropdown and SVG
  const container = d3.select(`#${containerId}`);

  // Create dropdown for Area Names
  const dropdown = container
    .append("select")
    .attr("class", "area-dropdown")
    .on("change", function () {
      const selectedArea = d3.select(this).property("value");
      updateLineChart(selectedArea);
    });

  // Populate dropdown options
  dropdown
    .selectAll("option")
    .data(uniqueAreaNames)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d);

  // Create an SVG container below the dropdown
  const svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set the x scale based on unique time periods
  const x = d3.scalePoint().domain(uniqueTimePeriods).range([0, width]);

  // Set the y scale
  const y = d3.scaleLinear().range([height, 0]);

  // Create x-axis
  const xAxisGroup = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Angling the x-axis labels for better readability
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Create y-axis
  const yAxisGroup = svg.append("g").attr("class", "y-axis");

  // Add horizontal grid lines
  const yGridLinesGroup = svg.append("g").attr("class", "grid");

  // Function to update the line chart based on the selected Area Name
  function updateLineChart(selectedArea) {
    // Filter data for the selected area
    const filteredData = chartData.filter(
      (data) => data["AreaName"] === selectedArea
    );

    // Determine y-axis key
    const yKey =
      filteredData[0]["Offences per 1,000 people"] !== undefined
        ? "Offences per 1,000 people"
        : "Percent";

    // Set y domain based on filtered data
    y.domain([0, d3.max(filteredData, (d) => d[yKey])]);

    // Update the y-axis
    yAxisGroup.transition().duration(500).call(d3.axisLeft(y));

    // Update the horizontal grid lines
    yGridLinesGroup
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width) // Extend grid lines across the chart
          .tickFormat("") // Hide tick labels
      )
      .selectAll(".tick line")
      .attr("stroke", "#ddd") // Set grid line color
      .attr("stroke-width", 1); // Set grid line width

    // Bind the filtered data to lines
    const lineGenerator = d3
      .line()
      .x((d) => x(d["Time period"]))
      .y((d) => y(d[yKey]));

    // Remove any existing lines and circles
    svg.selectAll(".line").remove();
    svg.selectAll(".circle").remove();

    // Append the line for the selected area
    const linePath = svg
      .append("path")
      .datum(filteredData)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "orange") // Changed line color to orange
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // Animate the line drawing
    const totalLength = linePath.node().getTotalLength();
    linePath
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Add circles for each data point
    const circles = svg
      .selectAll(".circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", (d) => x(d["Time period"]))
      .attr("cy", (d) => y(d[yKey]))
      .attr("r", 5)
      .attr("fill", "orange") // Change circle color to orange
      .attr("stroke", "black") // Circle border color to black
      .attr("stroke-width", 1) // Initial border thickness
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .attr("opacity", 1); // Fade in the circles

    // Append titles to circles for hover details
    circles.attr(
      "title",
      (d) =>
        `Area: ${d["AreaName"]}\nTime period: ${d["Time period"]}\nValue: ${d[yKey]}`
    );

    // Add event listeners for hover effects on circles
    circles
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).attr("stroke-width", 3); // Thicken the border on hover
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("stroke-width", 1); // Reset border thickness
      });
  }

  // Initially render the line chart for the first area
  const initialArea = uniqueAreaNames[0];
  dropdown.property("value", initialArea); // Set default value
  updateLineChart(initialArea); // Render initial line chart
}
