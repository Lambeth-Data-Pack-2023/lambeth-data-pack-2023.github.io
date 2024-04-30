function GridExample() {
  return (
    <div className="grid-container">
      <div
        className="grid-item"
        style={{ gridColumn: "span 2", gridRow: "span 4" }}
      >
        <h2>Introduction</h2>
        <p id="intro">Dynamically generate Category-Intro-Text here</p>
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 5" }}
      >
        <h2>Key Takeaways</h2>
        <p id="takeaways">Dynamically generate Category-Takeaways here</p>
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 1" }}
      >
        <h2>Summary 1</h2>
        <p id="summary1">Dynamically Generate Category-Summary-1 here</p>
      </div>
      <div
        className="grid-item"
        style={{ gridColumn: "span 1", gridRow: "span 1" }}
      >
        <h2>Summary 2</h2>
        <p id="summary2">Dynamically Generate Category-Summary-2 here</p>
      </div>
    </div>
  );
}

ReactDOM.render(<GridExample />, document.getElementById("root"));
