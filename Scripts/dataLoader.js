/**
 * Fetch and parse a CSV file using Papa Parse.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - Parsed CSV data.
 */
export async function fetchCSV(filePath) {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

/**
 * Fetch and parse a JSON file.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<Object>} - Parsed JSON data.
 */
export async function fetchJSON(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
  return response.json();
}
