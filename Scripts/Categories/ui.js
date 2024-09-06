// Scripts/Categories/ui.js

/**
 * Render the category details in the given HTML element.
 * @param {Object} category - The category data to render.
 * @param {HTMLElement} container - The HTML element where the details will be rendered.
 * @param {Array<Object>} charts - List of charts associated with the category.
 */
export function renderCategoryDetails(category, container, charts) {
  if (!category) {
    container.innerHTML = "<p>Category not found.</p>";
    return;
  }

  const chartsHtml = charts
    .map(
      (chart) =>
        `<li><a href="charts.html?id=${encodeURIComponent(chart.id)}">${
          chart.name
        }</a></li>`
    )
    .join("");

  container.innerHTML = `
        <h1>${category.name}</h1>
        <p>${category.introText}</p>
        <h2>Charts</h2>
        <ul>
            ${chartsHtml}
        </ul>
        <h3>Takeaways</h3>
        <p>${category.takeaways}</p>
        <h3>Summary</h3>
        <p>${category.summary1}</p>
        <p>${category.summary2}</p>
    `;
}
