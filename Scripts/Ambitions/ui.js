// Scripts/Ambitions/ui.js

/**
 * Render the ambition details in the given HTML element.
 * @param {Object} ambition - The ambition data to render.
 * @param {HTMLElement} container - The HTML element where the details will be rendered.
 * @param {Array<Object>} categories - List of categories associated with the ambition.
 */
export function renderAmbitionDetails(ambition, container, categories) {
  if (!ambition) {
    container.innerHTML = "<p>Ambition not found.</p>";
    return;
  }

  const categoriesHtml = categories
    .map(
      (category) =>
        `<li><a href="categories.html?id=${encodeURIComponent(
          category["Category-ID"]
        )}">${category["Category-Name"]}</a></li>`
    )
    .join("");

  container.innerHTML = `
        <h1>${ambition["Ambition-Name"]}</h1>
        <p>${ambition["Intro-Text"]}</p>
        <img src="${ambition["Ambition-Intro-Image"]}" alt="${ambition["Ambition-Name"]} Image">
        <h2>Categories</h2>
        <ul>
            ${categoriesHtml}
        </ul>
    `;
}
