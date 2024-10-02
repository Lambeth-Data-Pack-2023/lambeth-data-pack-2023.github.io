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
                `<li class="menu-chart-item"><a href="charts.html?id=${encodeURIComponent(
                  chart["Chart-ID"]
                )}" class="menu-chart-link">${
                  chart["Chart-Name"] || "Unnamed Chart"
                }</a></li>`
            );

          return `
            <li class="menu-category-item">
                <a href="categories.html?id=${encodeURIComponent(
                  category["Category-ID"]
                )}" class="menu-category-link">${
            category["Category-Name"] || "Unnamed Category"
          }</a>
                <ul class="menu-chart-list hidden">
                    ${relatedCharts.join("")}
                </ul>
            </li>
          `;
        });

      return `
        <li class="menu-ambition-item">
            <a href="ambitions.html?id=${encodeURIComponent(
              ambition["Ambition-ID"]
            )}" class="menu-ambition-link">${
        ambition["Ambition-Name"] || "Unnamed Ambition"
      }</a>
            <ul class="menu-category-list hidden">
                ${relatedCategories.join("")}
            </ul>
        </li>
      `;
    });

    // Build the menu HTML
    const menuHtml = `
      <ul class="menu-list">
          <li class="menu-home-item"><a href="index.html" class="menu-home-link">Home</a></li>
          ${ambitionStructure.join("")}
      </ul>
    `;

    // Insert the generated HTML into the menu element
    menuElement.innerHTML = menuHtml;

    // Add event listeners to toggle visibility on ambition list item click
    document.querySelectorAll(".menu-ambition-item").forEach((item) => {
      item.addEventListener("click", (event) => {
        if (
          !event.target.matches(".menu-ambition-link") &&
          !event.target.matches(".menu-category-link")
        ) {
          const categoryList = item.querySelector(".menu-category-list");
          categoryList.classList.toggle("hidden");
        }
      });
    });

    // Add event listeners to toggle visibility on category list item click
    document.querySelectorAll(".menu-category-item").forEach((item) => {
      item.addEventListener("click", (event) => {
        event.stopPropagation(); // Stop the event from bubbling up to the ambition item
        if (
          !event.target.matches(".menu-category-link") &&
          !event.target.matches(".menu-chart-link")
        ) {
          const chartList = item.querySelector(".menu-chart-list");
          chartList.classList.toggle("hidden");
        }
      });
    });
  } catch (error) {
    console.error("Error loading menu data:", error);
  }
});
