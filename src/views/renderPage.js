function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderSections(sections) {
  return sections
    .map(
      (section) => `
        <article class="card">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.body)}</p>
        </article>
      `
    )
    .join("");
}

function renderPage({ title, heading, description, sections = [] }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body>
        <main class="layout">
          <section class="hero">
            <p class="eyebrow">Node.js + Express</p>
            <h1>${escapeHtml(heading)}</h1>
            <p class="lead">${escapeHtml(description)}</p>
            <div class="actions">
              <a href="/" class="button">Home</a>
              <a href="/users/karan" class="button button-secondary">Dynamic Route</a>
            </div>
          </section>
          <section class="grid">
            ${renderSections(sections)}
          </section>
        </main>
      </body>
    </html>
  `;
}

module.exports = {
  renderPage
};
