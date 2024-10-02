// Scripts/Categories/ui.js

/**
 * Render the category details in the given HTML element.
 * @param {Object} category - The category data to render.
 * @param {HTMLElement} container - The HTML element where the details will be rendered.
 * @param {Array<Object>} charts - List of charts associated with the category.
 */
export function renderCategoryDetails(category, container, charts) {
  const currentId = Number(category.id);
  const nextCategory = Math.min(currentId + 1, 11); // Ensures nextCategory does not exceed CategoryID 11
  const prevCategory = Math.max(currentId - 1, 1);

  if (!category) {
    container.innerHTML = "<p class='text-red-500'>Category not found.</p>";
    return;
  }

  const chartsHtml = charts
    .map(
      (chart) =>
        `<li class="ml-4 text-sm">
        <a href="charts.html?id=${encodeURIComponent(chart.id)}" 
           class="text-blue-600 hover:text-blue-800">
          ${chart.name}
        </a>
      </li>`
    )
    .join("");

  container.innerHTML = `
  <h1 class="text-3xl font-bold text-gray-800 mb-4">${category.name}<img src="Images/Categories/${category.name}.png" class="icon inline-block ml-2" alt=""></h1>

  <div class="flex flex-col lg:flex-row gap-8 mb-8">
    <div class="flex-1 p-6 bg-white shadow-lg rounded-lg">
      <h3 class="text-2xl font-semibold mb-2">Introduction to ${category.name}</h3>
      <p class="text-sm text-gray-700">${category.introText}</p>
    </div>

    <div class="flex-1 p-6 bg-white shadow-lg rounded-lg">
      <h3 class="text-2xl font-semibold mb-2">Charts</h3>
      <ul class="list-disc list-inside text-gray-600">
        ${chartsHtml}
      </ul>
    </div>
  </div>

  <h3 class="text-2xl font-semibold mb-4">${category.name} Summary</h3>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
    <div class="p-6 bg-white shadow-lg rounded-lg">
      <p class="text-gray-700">${category.summary1}</p>
    </div>
    <div class="p-6 bg-white shadow-lg rounded-lg">
      <p class="text-gray-700">${category.summary2}</p>
    </div>
    <div class="p-6 bg-white shadow-lg rounded-lg">
      <p class="text-gray-700">${category.summary3}</p>
    </div>
  </div>

  <div class="flex justify-between">
    <a href="/categories.html?id=${prevCategory}">
      <button class="">
        Previous Category
      </button>
    </a>
    <a href="/categories.html?id=${nextCategory}">
      <button class="">
        Next Category
      </button>
    </a>
  </div>
`;
}
