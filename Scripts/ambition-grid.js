function GridExample() {
  return (
    <div className="grid-container">
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 3" }}
      >
        <h2>Introduction</h2>
        <p id="introText">Intro Text</p>
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 2", gridRow: "span 5" }}
      >
        <h2>Main Image</h2>
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 2" }}
      >
        <h2>Key Data</h2>
      </div>
    </div>
  );
}

ReactDOM.render(<GridExample />, document.getElementById("root"));
