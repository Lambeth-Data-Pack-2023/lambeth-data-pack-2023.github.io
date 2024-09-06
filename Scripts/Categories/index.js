// Scripts/Categories/index.js

import { getCategoryById, getChartsByCategoryId } from "./data.js";
import { renderCategoryDetails } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("id");

  if (!categoryId) {
    console.error("No category ID provided in the URL.");
    return;
  }

  const categoryDetailsContainer = document.getElementById("category-details");

  try {
    const [category, charts] = await Promise.all([
      getCategoryById(categoryId),
      getChartsByCategoryId(categoryId),
    ]);

    renderCategoryDetails(category, categoryDetailsContainer, charts);
  } catch (error) {
    console.error("Error fetching category data:", error);
    categoryDetailsContainer.innerHTML =
      "<p>Error loading category details.</p>";
  }
});
