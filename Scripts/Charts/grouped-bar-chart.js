function GroupedBarChart({ jsonData }) {
  // Effect hook to draw bar chart using D3.js
  React.useEffect(() => {
    if (jsonData) {
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 600 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const svg = d3
        .select("#groupedBarGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extract x-axis values dynamically
      const xPropertyName = Object.keys(jsonData[0])[0]; // Assuming the first property name is the x-axis property
      const xValues = jsonData.map((d) => d[xPropertyName]);
      console.log("X-axis values:", xValues);

      // Define the y-axis keys (percentage values)
      const yKeys = ["Lambeth (%)", "England (%)", "London (%)"];

      // Extract data for each x-axis value
      const data = xValues.map((d) => ({
        x: d,
        values: yKeys.map((y) => ({
          region: y.split(" ")[0], // Extract region name (Lambeth, London, England)
          percentage: +jsonData.find((entry) => entry[xPropertyName] === d)[y],
        })),
      }));

      const x = d3.scaleBand().domain(xValues).range([0, width]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d3.max(d.values, (v) => v.percentage))])
        .nice()
        .range([height, 0]);

      const color = d3
        .scaleOrdinal()
        .domain(yKeys.map((y) => y.split(" ")[0]))
        .range(d3.schemeCategory10);

      svg
        .selectAll(".bar-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", (d) => `translate(${x(d.x)},0)`)
        .selectAll(".bar")
        .data((d) => d.values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => (x.bandwidth() / 3) * i)
        .attr("width", x.bandwidth() / 3)
        .attr("y", (d) => y(d.percentage))
        .attr("height", (d) => height - y(d.percentage))
        .attr("fill", (d) => color(d.region));

      // Add x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Add y-axis
      svg.append("g").call(d3.axisLeft(y));
    }
  }, [jsonData]);

  return <div id="groupedBarGraph">{/* Bar graph will be drawn here */}</div>;
}
