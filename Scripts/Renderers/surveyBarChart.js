// Function to render survey bar chart
export function renderSurveyBarChart(chartData, chartContainer, chartMetadata) {
  console.log("Creating survey bar chart...");

  // Extract metadata keys
  const questionKey = "Question";
  const responseKey = "Response";
  const yLabel = chartMetadata["Y-Label"];
  const mainLocations = chartMetadata["Locations"];

  // Extract unique questions and locations from data
  const questions = [...new Set(chartData.map((d) => d[questionKey]))];
  const locations =
    mainLocations ||
    Object.keys(chartData[0]).filter(
      (key) => key !== questionKey && key !== responseKey
    );

  // Set up default selections (first question and first location)
  let selectedQuestion = questions[0];
  let selectedLocation = locations[0];

  // Set up dimensions and margins
  const margin = { top: 80, right: 20, bottom: 150, left: 50 };

  // Create SVG container
  const svg = d3
    .select(chartContainer)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales
  const xScale = d3.scaleBand().padding(0.1);
  const yScale = d3.scaleLinear();

  // Tooltip setup
  const tooltip = d3
    .select(chartContainer)
    .append("div")
    .attr("class", "tooltip")
    .style("display", "none");

  // Function to wrap text
  function wrapText(text, width) {
    const words = text.split(/\s+/);
    let line = "";
    const lines = [];

    for (let word of words) {
      const testLine = line + word + " ";
      const testWidth = getTextWidth(testLine);

      if (testWidth > width && line.length > 0) {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    }

    lines.push(line);
    return lines;
  }

  // Function to get text width
  function getTextWidth(text) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "16px Arial"; // Use the same font size as in your chart
    return context.measureText(text).width;
  }

  // Function to update the chart based on selected question and location
  function updateChart() {
    // Get new dimensions
    const width = chartContainer.clientWidth - margin.left - margin.right;
    const height = chartContainer.clientHeight - margin.top - margin.bottom;

    // Update scales
    xScale
      .range([0, width])
      .domain(
        chartData
          .filter((d) => d[questionKey] === selectedQuestion)
          .map((d) => d[responseKey])
      );
    yScale
      .range([height, 0])
      .domain([
        0,
        d3.max(
          chartData.filter((d) => d[questionKey] === selectedQuestion),
          (d) => d[selectedLocation]
        ),
      ])
      .nice();

    // Clear previous content
    svg.selectAll("*").remove();

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

    // Draw bars with transition
    const bars = svg.selectAll(".bar").data(
      chartData
        .filter((d) => d[questionKey] === selectedQuestion)
        .map((d) => ({
          response: d[responseKey],
          value: d[selectedLocation],
        }))
    );

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.response))
      .attr("width", xScale.bandwidth())
      .attr("y", height) // Start at the bottom of the chart
      .attr("height", 0) // Initial height is 0
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "orange");
        tooltip
          .style("display", "block")
          .html(`<strong>${d.response}</strong><br>Percentage: ${d.value}%`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("fill", "steelblue");
        tooltip.style("display", "none");
      })
      .transition() // Add transition
      .duration(1000) // Duration of 1 second
      .attr("y", (d) => yScale(d.value)) // Transition to the final y position
      .attr("height", (d) => height - yScale(d.value)); // Transition to the final height

    // Update axes
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

    svg.select(".y-label").remove();

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yLabel);

    // Update title with wrapping
    const title = selectedQuestion;
    svg.select(".title").remove();

    const titleLines = wrapText(title, width - 40); // Adjust padding as needed
    svg
      .selectAll(".title")
      .data(titleLines)
      .enter()
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", (d, i) => -40 + i * 20) // Adjust line height as needed
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial")
      .attr("font-size", "16px")
      .text((d) => d);
  }

  // Function to handle window resizing
  function resizeChart() {
    updateChart();
  }

  window.addEventListener("resize", resizeChart);

  // Dropdowns for question and location selection
  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "select-container";
  chartContainer.insertBefore(dropdownContainer, chartContainer.firstChild);

  const questionSelect = document.createElement("select");
  const locationSelect = document.createElement("select");

  questions.forEach((question) => {
    const option = document.createElement("option");
    option.value = question;
    option.textContent = question;
    questionSelect.appendChild(option);
  });

  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });

  questionSelect.value = selectedQuestion;
  locationSelect.value = selectedLocation;

  dropdownContainer.appendChild(questionSelect);
  dropdownContainer.appendChild(locationSelect);

  // Event listeners for dropdowns
  questionSelect.addEventListener("change", (event) => {
    selectedQuestion = event.target.value;
    updateChart();
  });

  locationSelect.addEventListener("change", (event) => {
    selectedLocation = event.target.value;
    updateChart();
  });

  // Initial chart rendering
  updateChart();

  console.log("Survey bar chart created successfully.");
}
