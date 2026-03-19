const express = require("express");
const {
  createActivityRow,
  deleteActivityRow,
  ensureActivityTable,
  getActivityRow,
  listActivityRows,
  normalizeActivityInput,
  seedActivityTable,
  updateActivityRow
} = require("../../lib/activityRepository");
const {
  renderAdminLayout,
  renderActivityForm,
  renderActivityTable
} = require("../../views/renderAdminLayout");

const router = express.Router();

async function prepareTable() {
  await ensureActivityTable();
  await seedActivityTable();
}

router.get("/", async (req, res) => {
  try {
    await prepareTable();
    const rows = await listActivityRows();
    res.send(
      renderAdminLayout({
        title: "Activity Admin",
        notice: req.query.notice,
        body: renderActivityTable(rows)
      })
    );
  } catch (error) {
    res.status(500).send(
      renderAdminLayout({
        title: "Activity Admin",
        error: error.message,
        body: "<section class=\"panel\"><h2>Database connection failed</h2><p>Set DATABASE_URL and run the table init script.</p></section>"
      })
    );
  }
});

router.get("/new", async (req, res) => {
  try {
    await prepareTable();
    const rows = await listActivityRows();
    res.send(
      renderAdminLayout({
        title: "New Activity Block",
        body: renderActivityForm({
          title: "Add activity block",
          action: "/admin/activity",
          submitLabel: "Create block",
          values: {
            id: "",
            type: "card",
            title: "",
            tabs: [],
            hasMap: false,
            icon: "",
            dateTime: "",
            amount: "",
            currency: "",
            status: "",
            position: rows.length + 1
          }
        })
      })
    );
  } catch (error) {
    res.status(500).send(
      renderAdminLayout({
        title: "New Activity Block",
        error: error.message,
        body: "<section class=\"panel\"><h2>Database connection failed</h2></section>"
      })
    );
  }
});

router.post("/", async (req, res) => {
  try {
    await prepareTable();
    const payload = normalizeActivityInput(req.body);
    await createActivityRow(payload);
    res.redirect("/admin/activity?notice=Block%20created.");
  } catch (error) {
    res.status(500).send(
      renderAdminLayout({
        title: "New Activity Block",
        error: error.message,
        body: renderActivityForm({
          title: "Add activity block",
          action: "/admin/activity",
          submitLabel: "Create block",
          values: normalizeActivityInput(req.body)
        })
      })
    );
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    await prepareTable();
    const row = await getActivityRow(req.params.id);

    if (!row) {
      res.status(404).send(
        renderAdminLayout({
          title: "Block not found",
          error: "Activity block not found.",
          body: "<section class=\"panel\"><h2>Missing block</h2></section>"
        })
      );
      return;
    }

    res.send(
      renderAdminLayout({
        title: `Edit ${row.id}`,
        body: renderActivityForm({
          title: `Edit ${row.id}`,
          action: `/admin/activity/${encodeURIComponent(row.id)}`,
          submitLabel: "Save changes",
          lockId: true,
          values: {
            id: row.id,
            type: row.type,
            title: row.title || "",
            tabs: Array.isArray(row.tabs) ? row.tabs : [],
            hasMap: row.has_map,
            icon: row.icon || "",
            dateTime: row.date_time || "",
            amount: row.amount === null || row.amount === undefined ? "" : Number(row.amount).toFixed(2),
            currency: row.currency || "",
            status: row.status || "",
            position: row.position
          }
        })
      })
    );
  } catch (error) {
    res.status(500).send(
      renderAdminLayout({
        title: "Edit Activity Block",
        error: error.message,
        body: "<section class=\"panel\"><h2>Database connection failed</h2></section>"
      })
    );
  }
});

router.post("/:id", async (req, res) => {
  try {
    await prepareTable();
    const payload = normalizeActivityInput(req.body);
    await updateActivityRow(req.params.id, payload);
    res.redirect("/admin/activity?notice=Block%20updated.");
  } catch (error) {
    res.status(500).send(
      renderAdminLayout({
        title: "Edit Activity Block",
        error: error.message,
        body: renderActivityForm({
          title: `Edit ${req.params.id}`,
          action: `/admin/activity/${encodeURIComponent(req.params.id)}`,
          submitLabel: "Save changes",
          lockId: true,
          values: normalizeActivityInput(req.body)
        })
      })
    );
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    await prepareTable();
    await deleteActivityRow(req.params.id);
    res.redirect("/admin/activity?notice=Block%20deleted.");
  } catch (error) {
    res.status(500).send(
      renderAdminLayout({
        title: "Delete Activity Block",
        error: error.message,
        body: "<section class=\"panel\"><h2>Delete failed</h2></section>"
      })
    );
  }
});

module.exports = router;
