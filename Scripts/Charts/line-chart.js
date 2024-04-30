function LineChart({ jsonData }) {
  // D3.js code for rendering line chart
  // Effect hook to draw line graph using D3.js
  React.useEffect(() => {
    if (jsonData) {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const svg = d3
        .select("#lineGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract unique time periods
      const uniqueTimePeriods = Array.from(
        new Set(jsonData.map((d) => d["Time period"]))
      );

      const x = d3
        .scaleBand()
        .domain(uniqueTimePeriods)
        .range([0, width])
        .padding(0.1);

      // Find the minimum and maximum values of the data
      const minValue = d3.min(jsonData, (d) => +d.Value);
      const maxValue = d3.max(jsonData, (d) => +d.Value);

      // Calculate a suitable y-axis range based on the data range
      const yDomainMin = minValue - 0.1 * (maxValue - minValue); // Add a margin of 10% below the minimum value
      const yDomainMax = maxValue + 0.1 * (maxValue - minValue); // Add a margin of 10% above the maximum value

      const y = d3
        .scaleLinear()
        .domain([yDomainMin, yDomainMax])
        .nice()
        .range([height, 0]);

      const areaNames = Array.from(new Set(jsonData.map((d) => d["AreaName"]))); // Get unique area names

      // Define color scale for lines
      const color = d3
        .scaleOrdinal()
        .domain(areaNames)
        .range(d3.schemeCategory10);

      // Draw lines for each area name
      areaNames.forEach((areaName, i) => {
        const areaData = jsonData.filter((d) => d["AreaName"] === areaName);
        const line = d3
          .line()
          .x((d) => x(d["Time period"]) + x.bandwidth() / 2)
          .y((d) => y(+d.Value));

        svg
          .append("path")
          .datum(areaData)
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", color(areaName))
          .attr("d", line);
      });

      // Add x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add y-axis
      svg.append("g").call(d3.axisLeft(y));
    }
  }, [jsonData]);

  return <div id="lineGraph">{/* Line graph will be drawn here */}</div>;
}
