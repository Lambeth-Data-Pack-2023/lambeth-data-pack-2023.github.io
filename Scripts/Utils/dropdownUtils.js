// Scripts/Utils/dropdownUtils.js

export function createDropdown(mapContainer, chartData, mapType) {
  const existingDropdown = document.getElementById("data-dropdown");
  if (existingDropdown) {
    existingDropdown.remove();
    console.log("Existing dropdown removed");
  }

  const dropdown = document.createElement("select");
  dropdown.id = "data-dropdown";
  mapContainer.appendChild(dropdown);

  if (mapType === "bar") {
    populateBarDropdown(dropdown, chartData);
  } else if (mapType === "line") {
    populateLineDropdown(dropdown, chartData);
  }

  // Handle dropdown change
  dropdown.addEventListener("change", () => {
    const selectedValue = dropdown.value;
    console.log(`Selected Value: ${selectedValue}`);
  });
}

function populateBarDropdown(dropdown, chartData) {
  const uniqueKeys = new Set();
  chartData.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key.includes("%")) {
        uniqueKeys.add(key);
      }
    });
  });

  uniqueKeys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    dropdown.appendChild(option);
  });
}

function populateLineDropdown(dropdown, chartData) {
  const uniquePeriods = new Set();
  chartData.forEach((entry) => {
    uniquePeriods.add(entry["Time period"]);
  });

  uniquePeriods.forEach((period) => {
    const option = document.createElement("option");
    option.value = period;
    option.textContent = period;
    dropdown.appendChild(option);
  });
}
