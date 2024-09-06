// Scripts/Categories/data.js

import { fetchCSV } from "../dataLoader.js";

/**
 * Fetch the category data based on the provided ID.
 * @param {string} categoryId - The ID of the category to fetch.
 * @returns {Object} - The category data.
 */
export async function getCategoryById(categoryId) {
  const data = await fetchCSV("Data/Content/Category-Database.csv");
  return data
    .map((item) => ({
      id: item["Category-ID"],
      name: item["Category-Name"],
      ambitionId: item["Ambition-ID"],
      introText: item["Category-Intro-Text"],
      takeaways: item["Category-Takeaways"],
      summary1: item["Category-Summary-1"],
      summary2: item["Category-Summary-2"],
    }))
    .find((category) => category.id === categoryId);
}

/**
 * Fetch charts associated with a specific category ID.
 * @param {string} categoryId - The ID of the category whose charts you want to fetch.
 * @returns {Array<Object>} - List of charts associated with the category.
 */
export async function getChartsByCategoryId(categoryId) {
  const data = await fetchCSV("Data/Content/Chart-Database.csv");
  return data
    .filter((chart) => chart["Category-ID"] === categoryId)
    .map((chart) => ({
      id: chart["Chart-ID"],
      name: chart["Chart-Name"],
      chartType: chart["Chart-Type"],
      filePath: chart["File-Path"],
      tableCommentary: chart["Table Commentary"],
      pageCommentary: chart["Page Commentary"],
      displayed: chart["Chart-Displayed"],
      yLabel: chart["Y-Label"],
      mapType: chart["Map-Type"],
    }));
}
