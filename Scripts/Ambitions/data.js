// Scripts/Ambitions/data.js

import { fetchCSV } from "../dataLoader.js";

/**
 * Fetch the ambition data based on the provided ID.
 * @param {string} ambitionId - The ID of the ambition to fetch.
 * @returns {Object} - The ambition data.
 */
export async function getAmbitionById(ambitionId) {
  const ambitions = await fetchCSV("Data/Content/Ambition-Database.csv");
  return ambitions.find((ambition) => ambition["Ambition-ID"] === ambitionId);
}

/**
 * Fetch categories associated with a specific ambition ID.
 * @param {string} ambitionId - The ID of the ambition whose categories you want to fetch.
 * @returns {Array<Object>} - List of categories associated with the ambition.
 */
export async function getCategoriesByAmbitionId(ambitionId) {
  const categories = await fetchCSV("Data/Content/Category-Database.csv");
  return categories.filter(
    (category) => category["Ambition-ID"] === ambitionId
  );
}
