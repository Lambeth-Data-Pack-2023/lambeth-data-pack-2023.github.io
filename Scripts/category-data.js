async function fetchData(url) {
  const response = await fetch(url);
  const text = await response.text();
  return Papa.parse(text, { header: true }).data;
}

async function populateCategoryContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  const csvData = await fetchData("/Content/Category-Database.csv");
  const category =
    csvData.find((row) => row["Category-Name"] === categoryParam) || {};
  const pageTitle = `Lambeth | ${category["Category-Name"]}`;
  document.title = pageTitle; // Set document title dynamically
  document.getElementById("categoryTitle").innerText =
    category["Category-Name"];
  document.querySelector("p#intro").innerText = category["Category-Intro-Text"];
  document.querySelector("p#takeaways").innerText =
    category["Category-Takeaways"];
  document.querySelector("p#summary1").innerText =
    category["Category-Summary-1"];
  document.querySelector("p#summary2").innerText =
    category["Category-Summary-2"];
  document.querySelector("p#summary3").innerText =
    category["Category-Summary-3"];
}

populateCategoryContent();
