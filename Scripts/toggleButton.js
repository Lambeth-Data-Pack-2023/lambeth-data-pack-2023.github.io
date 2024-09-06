document.addEventListener("DOMContentLoaded", function () {
  // Populate the header with the button
  displayHeader();

  // Now attach the event listener to the dynamically added button
  document.querySelectorAll(".toggleButton").forEach(function (button) {
    button.addEventListener("click", function () {
      var targetId = this.getAttribute("data-target");
      toggleExpand(targetId);
    });
  });
});

function toggleExpand(containerId) {
  var container = document.getElementById(containerId);
  container.classList.toggle("expanded");
}
