// Scripts/Ambitions/ui.js

/**
 * Render the ambition details in the given HTML element.
 * @param {Object} ambition - The ambition data to render.
 * @param {HTMLElement} container - The HTML element where the details will be rendered.
 * @param {Array<Object>} categories - List of categories associated with the ambition.
 */
export function renderAmbitionDetails(ambition, container, categories) {
  const currentId = Number(ambition["Ambition-ID"]);
  const nextAmbition = Math.min(currentId + 1, 4);
  const prevAmbition = Math.max(currentId - 1, 1);
  if (!ambition) {
    container.innerHTML = `<p class="text-red-500 font-semibold">Ambition not found.</p>`;
    return;
  }

  // Generate the categories HTML with Tailwind styling
  const categoriesHtml = categories
    .map(
      (category) =>
        `<li class="mb-2">
           <a href="categories.html?id=${encodeURIComponent(
             category["Category-ID"]
           )}" 
           class="text-blue-900 hover:text-yellow-500 transition-colors duration-300">
<img src="Images/Categories/${
          category["Category-Name"]
        }.png" class="icon" alt="">
           <h4>${category["Category-Name"]}</h4>
           </a>
        </li>`
    )
    .join("");

  // Populate the container with the ambition details using Tailwind styling
  container.innerHTML = `
  <h1 class="text-4xl font-bold text-gray-800 mb-4">
        ${ambition["Ambition-Name"]}
      </h1>
    <div class="flex py-8 px-6 bg-gray-50 rounded-lg shadow-lg">
    <div class="max-50">
      
      
      <p class="text-lg text-gray-600 mb-6 px-6">
        ${ambition["Intro-Text"]}
      </p>
      <h3 class="text-2xl font-semibold mb-4">Categories</h2>
      <ul class="list-disc list-inside">
        ${categoriesHtml}
      </ul>
      <div class="ambition-nav-buttons">
      <a href="/ambitions.html?id=${prevAmbition}"><button>Previous Ambition</button></a>
        <a href="/ambitions.html?id=${nextAmbition}"><button>Next Ambition</button></a>
        </div>
      </div>
      <div class="flex centred">
      <img src="Images/Ambition Introductions/${ambition["Ambition-ID"]}.png" 
           alt="${ambition["Ambition-Name"]} Image" 
           class="w-full h-auto rounded-lg shadow-md mb-6">
      </div>
      
    </div>
  `;
}
