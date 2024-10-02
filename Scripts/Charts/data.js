// Scripts/Charts/data.js

import { fetchCSV, fetchJSON } from "../dataLoader.js";

/**
 * Fetch chart metadata based on the chart ID.
 * @param {string} chartId - The ID of the chart to fetch data for.
 * @returns {Promise<Object|null>} - The chart metadata or null if not found.
 */
export async function fetchChartMetadata(chartId) {
  const charts = await fetchCSV("Data/Content/Chart-Database.csv");
  return charts.find((chart) => chart["Chart-ID"] === chartId) || null;
}

/**
 * Fetch the data needed to render the chart from a JSON file.
 * @param {string} filePath - The path to the JSON file containing the chart data.
 * @returns {Promise<Object>} - The chart data.
 */
export async function fetchChartData(filePath) {
  return await fetchJSON(`Data/Charts-JSON/${filePath}`);
}

/**
 * Fetch GeoJSON data from the specified path.
 * @param {string} geojsonPath - The path to the GeoJSON file.
 * @returns {Promise<Object>} - The GeoJSON data.
 */
export async function fetchGeoJSONData(geojsonPath) {
  const response = await fetch(geojsonPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON data from ${geojsonPath}`);
  }
  return await response.json();
}
