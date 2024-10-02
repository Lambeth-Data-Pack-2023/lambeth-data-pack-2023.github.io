export function renderMapBar(containerId, chartData) {
  // Define AreaNames to exclude from the dropdown
  const excludedAreaNames = ["London", "Lambeth", "England"];

  // Select the container where the chart will be rendered
  const container = d3.select(`#${containerId}`);

  // Clear any existing elements in the container
  container.html("");

  // Create a dropdown for selecting AreaName
  const dropdown = container.append("select").attr("class", "area-dropdown");

  // Populate the dropdown with AreaNames excluding the specified ones
  dropdown
    .selectAll("option")
    .data(chartData.filter((d) => !excludedAreaNames.includes(d.AreaName))) // Filter out excluded names
    .enter()
    .append("option")
    .attr("value", (d, i) => i) // Use index as value
    .text((d) => d.AreaName);

  // Create an SVG element for the bar chart
  const svg = container.append("svg").attr("id", "responsive-svg");

  // Function to render the bar chart for a selected AreaName
  function renderBarChart(areaIndex) {
    // Clear previous chart content
    svg.selectAll("*").remove();

    // Get the selected area's data
    const selectedAreaData = chartData.filter(
      (d) => !excludedAreaNames.includes(d.AreaName)
    )[areaIndex];

    // Extract only the keys and values that end with "(%)"
    const percentageKeys = [];
    const percentageValues = [];

    Object.keys(selectedAreaData).forEach((key) => {
      if (key.endsWith("(%)")) {
        percentageKeys.push(key);
        percentageValues.push(selectedAreaData[key]);
      }
    });

    // Set up margins and dimensions for the chart
    const margin = { top: 20, right: 30, bottom: 100, left: 50 };

    // Calculate dynamic width and height based on container size
    const containerWidth = container.node().getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    svg.attr("width", containerWidth).attr("height", 400);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the scales
    const xScale = d3
      .scaleBand()
      .domain(percentageKeys)
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(percentageValues)]) // Use max value for the Y-axis
      .range([height, 0]);

    // Add horizontal grid lines
    chart
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

    // Create the axes
    chart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    chart.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // Create the bars with animation
    chart
      .selectAll(".bar")
      .data(percentageValues)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(percentageKeys[i]))
      .attr("y", height) // Start from the bottom of the SVG
      .attr("width", xScale.bandwidth())
      .attr("height", 0) // Start with height 0
      .attr("fill", "orange")
      .transition() // Start transition
      .duration(750) // Animation duration in milliseconds
      .attr("y", (d) => yScale(d)) // Move to the correct Y position
      .attr("height", (d) => height - yScale(d)); // Animate height
  }

  // Initial rendering of the chart for the first area
  renderBarChart(0); // Render for the first AreaName by default

  // Update the chart when a new AreaName is selected from the dropdown
  dropdown.on("change", function () {
    const selectedIndex = d3.select(this).property("value");
    renderBarChart(selectedIndex);
  });

  // Function to handle resizing and redraw the chart
  function handleResize() {
    renderBarChart(dropdown.node().selectedIndex);
  }

  // Add event listener to handle window resize
  window.addEventListener("resize", handleResize);
}
