// footer.js

// Function to populate the footer using innerHTML
function displayFooter() {
  // Get the footer element
  const footer = document.querySelector("footer");

  // Populate the footer's innerHTML
  footer.innerHTML = `
            <p class="footer-copyright">
                © ${new Date().getFullYear()} Lambeth Open Data Platform. All rights reserved.
            </p>
            <p>
            Designed by <a href="http://www.land-smyrna.com">Smyrna Aesthetics</a>
            </p>
    `;
}

// Call the function to populate the footer when the page loads
document.addEventListener("DOMContentLoaded", displayFooter);
