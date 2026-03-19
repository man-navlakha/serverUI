function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderAdminLayout({ title, body, notice = "", error = "" }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="/static/admin.css" />
      </head>
      <body>
        <div class="shell">
          <aside class="sidebar">
            <p class="kicker">Admin</p>
            <h1>Activity Editor</h1>
            <p class="muted">Manage the blocks for the activity page directly from Postgres.</p>
            <nav>
              <a href="/admin/activity">All blocks</a>
              <a href="/admin/activity/new">Add block</a>
              <a href="/v1/home/page/activity" target="_blank" rel="noreferrer">Open API</a>
            </nav>
          </aside>
          <main class="content">
            ${notice ? `<div class="banner success">${escapeHtml(notice)}</div>` : ""}
            ${error ? `<div class="banner error">${escapeHtml(error)}</div>` : ""}
            ${body}
          </main>
        </div>
      </body>
    </html>
  `;
}

function renderActivityTable(rows) {
  const body = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.position)}</td>
          <td>${escapeHtml(row.id)}</td>
          <td>${escapeHtml(row.type)}</td>
          <td>${escapeHtml(row.title)}</td>
          <td>${escapeHtml(row.dateTime)}</td>
          <td>${escapeHtml(row.amount)}</td>
          <td class="actions">
            <a class="button secondary" href="/admin/activity/${encodeURIComponent(row.id)}/edit">Edit</a>
            <form method="post" action="/admin/activity/${encodeURIComponent(row.id)}/delete">
              <button class="button danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Database Rows</p>
          <h2>Activity blocks</h2>
        </div>
        <a class="button" href="/admin/activity/new">Add block</a>
      </div>
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>ID</th>
            <th>Type</th>
            <th>Title</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </section>
  `;
}

function renderActivityForm({ title, action, submitLabel, values, lockId = false }) {
  const tabsValue = Array.isArray(values.tabs) ? values.tabs.join(", ") : "";

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Editor</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <a class="button secondary" href="/admin/activity">Back</a>
      </div>
      <form class="form-grid" method="post" action="${escapeHtml(action)}">
        <label>
          <span>ID</span>
          <input name="id" value="${escapeHtml(values.id)}"${lockId ? " readonly" : ""} required />
        </label>
        <label>
          <span>Type</span>
          <select name="type">
            <option value="header"${values.type === "header" ? " selected" : ""}>header</option>
            <option value="tabs"${values.type === "tabs" ? " selected" : ""}>tabs</option>
            <option value="card"${values.type === "card" ? " selected" : ""}>card</option>
          </select>
        </label>
        <label>
          <span>Position</span>
          <input name="position" type="number" min="1" value="${escapeHtml(values.position)}" required />
        </label>
        <label class="full">
          <span>Title</span>
          <input name="title" value="${escapeHtml(values.title)}" />
        </label>
        <label class="full">
          <span>Tabs (comma separated)</span>
          <input name="tabs" value="${escapeHtml(tabsValue)}" />
        </label>
        <label>
          <span>Icon</span>
          <input name="icon" value="${escapeHtml(values.icon)}" />
        </label>
        <label>
          <span>Date Time</span>
          <input name="dateTime" value="${escapeHtml(values.dateTime)}" />
        </label>
        <label>
          <span>Amount</span>
          <input name="amount" value="${escapeHtml(values.amount)}" />
        </label>
        <label>
          <span>Currency</span>
          <input name="currency" value="${escapeHtml(values.currency)}" />
        </label>
        <label>
          <span>Status</span>
          <input name="status" value="${escapeHtml(values.status)}" />
        </label>
        <label class="checkbox">
          <input name="hasMap" type="checkbox"${values.hasMap ? " checked" : ""} />
          <span>Has Map</span>
        </label>
        <div class="full actions-row">
          <button class="button" type="submit">${escapeHtml(submitLabel)}</button>
        </div>
      </form>
    </section>
  `;
}

module.exports = {
  renderAdminLayout,
  renderActivityTable,
  renderActivityForm
};
