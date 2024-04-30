// Define constants for CSV file path and column names
const CSV_PATH = "/Content/Ambition-Database.csv";
const AMBITION_ID_COLUMN = "Ambition-ID";
const AMBITION_NAME_COLUMN = "Ambition-Name";
const INTRO_TEXT_COLUMN = "Intro-Text";

// Function to fetch CSV data and populate HTML elements
function fetchDataAndPopulateElements() {
  fetch(CSV_PATH)
    .then((response) => response.text())
    .then(parseCsvData)
    .then(populateHtmlElements)
    .catch((error) => console.error("Error fetching CSV data:", error));
}

// Function to parse CSV data using Papa Parse
function parseCsvData(csvData) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      complete: function (results) {
        resolve(results.data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

// Function to populate HTML elements with ambition data
function populateHtmlElements(data) {
  const urlParams = new URLSearchParams(window.location.search);
  const ambitionId = urlParams.get("ambition");

  if (!ambitionId) {
    console.error("Ambition ID not found in URL parameter");
    return;
  }

  const ambition = data.find((row) => row[AMBITION_ID_COLUMN] === ambitionId);

  if (!ambition) {
    console.error("Ambition data not found for ID:", ambitionId);
    return;
  }

  document.getElementById("ambitionTitle").innerText =
    ambition[AMBITION_NAME_COLUMN];
  document.getElementById("introText").innerText = ambition[INTRO_TEXT_COLUMN];

  // Set page title based on the current ambition
  setPageTitle(ambition[AMBITION_ID_COLUMN]);
}

// Function to set the page title
function setPageTitle(ambitionID) {
  document.title = `Lambeth | Ambition ${ambitionID}`;
}

// Call the function to fetch data and populate HTML elements
fetchDataAndPopulateElements();
