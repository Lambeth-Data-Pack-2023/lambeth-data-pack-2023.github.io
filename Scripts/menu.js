import { fetchCSV } from "./dataLoader.js";

document.addEventListener("DOMContentLoaded", async () => {
  const menuElement = document.querySelector("menu");
  if (!menuElement) {
    console.error("Menu element not found!");
    return;
  }

  try {
    // Fetch the data from CSV files
    const ambitions = await fetchCSV("Data/Content/Ambition-Database.csv");
    const categories = await fetchCSV("Data/Content/Category-Database.csv");
    const charts = await fetchCSV("Data/Content/Chart-Database.csv");

    // Create a map for quick access
    const categoryMap = categories.reduce((map, category) => {
      map[category["Category-ID"]] = category;
      return map;
    }, {});

    const ambitionMap = ambitions.reduce((map, ambition) => {
      map[ambition["Ambition-ID"]] = ambition;
      return map;
    }, {});

    // Create a nested structure for categories and charts
    const ambitionStructure = ambitions.map((ambition) => {
      const relatedCategories = categories
        .filter(
          (category) => category["Ambition-ID"] === ambition["Ambition-ID"]
        )
        .map((category) => {
          const relatedCharts = charts
            .filter((chart) => chart["Category-ID"] === category["Category-ID"])
            .map(
              (chart) =>
                `<li class="menu-chart-item pl-6">
                  <a href="charts.html?id=${encodeURIComponent(
                    chart["Chart-ID"]
                  )}" class="menu-chart-link block px-4 py-2 text-sm text-gray-200">
                    ${chart["Chart-Name"] || "Unnamed Chart"}
                  </a>
                </li>`
            );

          return `
            <li class="menu-category-item flex-c">
                <div class="flex justify-between items-center">
                    <a href="categories.html?id=${encodeURIComponent(
                      category["Category-ID"]
                    )}" class="menu-category-link px-4 py-2 text-gray-200">
                      ${category["Category-Name"] || "Unnamed Category"}
                    </a>
                    <button class="toggle-category focus:outline-none px-2">
                        <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <ul class="menu-chart-list hidden pl-6">
                    ${relatedCharts.join("")}
                </ul>
            </li>
          `;
        });

      return `
        <li class="menu-ambition-item flex-c">
            <div class="flex justify-between items-center">
                <a href="ambitions.html?id=${encodeURIComponent(
                  ambition["Ambition-ID"]
                )}" class="menu-ambition-link px-4 py-2 text-gray-200">
                  ${ambition["Ambition-Name"] || "Unnamed Ambition"}
                </a>
                <button class="toggle-ambition focus:outline-none px-2">
                    <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <!-- Move the dropdown list (ul) outside the flex div -->
            <ul class="menu-category-list hidden pl-4">
                ${relatedCategories.join("")}
            </ul>
        </li>
      `;
    });

    // Build the menu HTML
    const menuHtml = `
      <ul class="menu-list space-y-2">
          <li class="menu-home-item">
            <a href="index.html" class="menu-home-link block px-4 py-2 text-gray-200">Home</a>
          </li>
          ${ambitionStructure.join("")}
      </ul>
    `;

    // Insert the generated HTML into the menu element
    menuElement.innerHTML = menuHtml;

    // Add event listeners to toggle visibility on ambition toggle button click
    document.querySelectorAll(".toggle-ambition").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click from propagating
        const categoryList = button
          .closest(".menu-ambition-item")
          .querySelector(".menu-category-list");
        categoryList.classList.toggle("hidden");
      });
    });

    // Add event listeners to toggle visibility on category toggle button click
    document.querySelectorAll(".toggle-category").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click from propagating
        const chartList = button
          .closest(".menu-category-item")
          .querySelector(".menu-chart-list");
        chartList.classList.toggle("hidden");
      });
    });
  } catch (error) {
    console.error("Error loading menu data:", error);
  }
});
