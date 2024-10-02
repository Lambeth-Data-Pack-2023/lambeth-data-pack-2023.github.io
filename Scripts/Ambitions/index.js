// Scripts/Ambitions/index.js

import { getAmbitionById, getCategoriesByAmbitionId } from "./data.js";
import { renderAmbitionDetails } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ambitionId = urlParams.get("id");

  if (!ambitionId) {
    console.error("No ambition ID provided in the URL.");
    return;
  }

  const ambitionDetailsContainer = document.getElementById("ambition-details");

  try {
    const [ambition, categories] = await Promise.all([
      getAmbitionById(ambitionId),
      getCategoriesByAmbitionId(ambitionId),
    ]);

    renderAmbitionDetails(ambition, ambitionDetailsContainer, categories);
  } catch (error) {
    console.error("Error fetching ambition data:", error);
    ambitionDetailsContainer.innerHTML =
      "<p>Error loading ambition details.</p>";
  }
});
