// Function to draw line graph based on chart name from URL parameter
function GridExample() {
  // Parse URL to extract name
  const url = window.location.href;
  const name = decodeURIComponent(url.split("=")[1]);

  // State to hold CSV data
  const [csvData, setCsvData] = React.useState([]);
  const [filePath, setFilePath] = React.useState("");
  const [rowData, setRowData] = React.useState(null); // Initialize rowData as null

  // Function to fetch and parse CSV data
  React.useEffect(() => {
    Papa.parse("/Content/Data-Sources-Ambitions.csv", {
      download: true,
      header: true,
      complete: function (results) {
        setCsvData(results.data);
      },
    });
  }, []);

  // Find corresponding row based on name and set the file path
  React.useEffect(() => {
    if (csvData.length > 0) {
      const foundRow = csvData.find((row) => row["Visual short name"] === name);
      if (foundRow) {
        setRowData(foundRow);
        setFilePath(foundRow["File-Path"]);
      }
    }
  }, [csvData, name]);

  // Render content
  return (
    <div className="grid-container">
      <div
        className="grid-item"
        style={{ gridColumn: "span 2", gridRow: "span 5" }}
      >
        {/* Display Graph Here */}
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 3" }}
      >
        <h2>Chart Info</h2>
        <p>{rowData ? rowData["Table commentary"] : "No data found"}</p>
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 2" }}
      >
        <h2>Chart Commentary</h2>
        <p>{rowData ? rowData["Page commentary"] : "No data found"}</p>
      </div>
    </div>
  );
}

// Render the GridExample component in the root div
ReactDOM.render(<GridExample />, document.getElementById("root"));
