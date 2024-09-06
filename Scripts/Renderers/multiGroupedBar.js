import { setupChart, addXAxis, addYAxis, addYAxisLabel } from "./chartUtils.js";

/**
 * Renders a grouped bar chart using D3.js.
 * @param {Array<Object>} data - The data to be visualized.
 * @param {HTMLElement} container - The DOM element to render the chart into.
 * @param {Object} chartData - The metadata containing chart configurations.
 */
export function renderMultiGroupedBarChart(
  data,
  container,
  chartData,
  legendX = 0,
  legendY = 0
) {
  const renderChart = () => {
    d3.select(container).select("svg").remove();

    const { width, height, margin, svg, xScale, yScale } = setupChart(
      container,
      chartData,
      d3.scaleBand
    );

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#fff");

    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);

    const xAxisKey = chartData["X-Axis-Key"];
    const yAxisKey = chartData["Y-Axis-Key"];
    const thirdVarKey = chartData["Third-Var-Key"];
    const yLabel = chartData["Y-Label"];
    const timePeriods = [...new Set(data.map((d) => d["Time period"]))];

    console.log("Available time periods:", timePeriods);

    const timePeriodSelect = d3
      .select(container)
      .append("select")
      .attr("class", "time-period-select")
      .selectAll("option")
      .data(timePeriods)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    let selectedTimePeriod = timePeriods[0];
    const updateData = (timePeriod) => {
      const selectedPeriod = Number(timePeriod);
      console.log("Updating data for time period:", selectedPeriod);

      const filteredData = data.filter(
        (d) => d["Time period"] === selectedPeriod
      );
      console.log(
        `Filtered data for time period ${selectedPeriod}:`,
        filteredData
      );

      if (filteredData.length === 0) {
        console.log("No data available for the selected time period.");
        return;
      }

      const groupedData = d3.group(filteredData, (d) => d[xAxisKey]);

      xScale.domain(groupedData.keys());
      yScale.domain([0, d3.max(filteredData, (d) => +d[yAxisKey])]).nice();

      addXAxis(svg, xScale, height);
      addYAxis(svg, yScale);
      addYAxisLabel(svg, yLabel, margin, height);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      svg.selectAll(".bar-group").remove();

      svg
        .selectAll(".bar-group")
        .data(Array.from(groupedData.entries()))
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", ([key, _]) => `translate(${xScale(key)}, 0)`)
        .selectAll("rect")
        .data(([key, values]) => values)
        .enter()
        .append("rect")
        .attr("x", (d, i) => (xScale.bandwidth() / (groupedData.size + 1)) * i)
        .attr("y", (d) => yScale(+d[yAxisKey]))
        .attr("width", xScale.bandwidth() / (groupedData.size + 1))
        .attr("height", (d) => height - yScale(+d[yAxisKey]))
        .attr("fill", (d) => colorScale(d[thirdVarKey]))
        .style("cursor", "pointer")
        .append("title")
        .text((d) => `${d[thirdVarKey]}: ${d[yAxisKey]}%`);

      svg
        .selectAll("rect")
        .on("mouseover", function (event, d) {
          d3.select(this).attr(
            "fill",
            d3.color(colorScale(d[thirdVarKey])).brighter(1)
          );
        })
        .on("mouseout", function (event, d) {
          d3.select(this).attr("fill", colorScale(d[thirdVarKey]));
        });

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${legendX}, ${legendY})`);

      const legendItems = Array.from(
        new Set(filteredData.map((d) => d[thirdVarKey]))
      );

      legend
        .selectAll(".legend-item")
        .data(legendItems)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)
        .each(function (d) {
          const g = d3.select(this);

          g.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale(d));

          g.append("text")
            .attr("x", 30)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(d);
        });
    };

    updateData(selectedTimePeriod);

    d3.select(".time-period-select").on("change", function () {
      selectedTimePeriod = this.value;
      console.log("Time period changed to:", selectedTimePeriod);
      updateData(selectedTimePeriod);
    });

    window.addEventListener("resize", renderChart);
  };

  renderChart();
}
