import { SHORT_APP_NAME, INSTITUCION } from "./config.js";

export function setTitle(pageName) {
  if (pageName) {
    document.title = `${pageName} | ${SHORT_APP_NAME}`;
  } else {
    document.title = SHORT_APP_NAME;
  }
}

export function loadFooter() {
  const year = new Date().getFullYear();

  const footerHTML = `
    <div class="container mt-auto">
      <footer class="py-3 my-4 border-top">
        <p class="text-center text-body-secondary mb-0">
          © ${year} ${INSTITUCION}
        </p>
      </footer>
    </div>
  `;

  const container = document.getElementById('footer-container');

  if (container) {
    container.innerHTML = footerHTML;
  }
}


