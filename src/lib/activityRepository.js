const { activityPageSeed } = require("../data/activityPageSeed");
const { query } = require("./db");

const TABLE_NAME = "home_page_activity_blocks";

function blockToRow(block, index) {
  return {
    id: block.id || `block-${index + 1}`,
    type: block.type,
    title: block.title || null,
    tabs: block.tabs || null,
    hasMap: block.hasMap || false,
    icon: block.icon || null,
    dateTime: block.dateTime || null,
    amount: block.amount || null,
    currency: block.currency || null,
    status: block.status || null,
    position: index + 1
  };
}

function rowToBlock(row) {
  const block = {
    type: row.type
  };

  if (row.type === "card") {
    block.id = row.id;
  }

  if (row.title) {
    block.title = row.title;
  }

  if (Array.isArray(row.tabs)) {
    block.tabs = row.tabs;
  }

  if (row.has_map) {
    block.hasMap = true;
  }

  if (row.icon) {
    block.icon = row.icon;
  }

  if (row.date_time) {
    block.dateTime = row.date_time;
  }

  if (row.amount !== null && row.amount !== undefined) {
    block.amount = Number(row.amount).toFixed(2);
  }

  if (row.currency) {
    block.currency = row.currency;
  }

  if (row.status) {
    block.status = row.status;
  }

  return block;
}

function parseTabs(value) {
  if (!value) {
    return null;
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function ensureActivityTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT,
      tabs JSONB,
      has_map BOOLEAN NOT NULL DEFAULT FALSE,
      icon TEXT,
      date_time TEXT,
      amount NUMERIC(12, 2),
      currency TEXT,
      status TEXT,
      position INTEGER NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function seedActivityTable() {
  const existing = await query(`SELECT COUNT(*)::int AS count FROM ${TABLE_NAME}`);

  if (existing.rows[0].count > 0) {
    return;
  }

  for (const [index, block] of activityPageSeed.entries()) {
    const row = blockToRow(block, index);

    await query(
      `
        INSERT INTO ${TABLE_NAME} (
          id,
          type,
          title,
          tabs,
          has_map,
          icon,
          date_time,
          amount,
          currency,
          status,
          position
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `,
      [
        row.id,
        row.type,
        row.title,
        row.tabs ? JSON.stringify(row.tabs) : null,
        row.hasMap,
        row.icon,
        row.dateTime,
        row.amount,
        row.currency,
        row.status,
        row.position
      ]
    );
  }
}

async function listActivityBlocks() {
  const result = await query(
    `
      SELECT id, type, title, tabs, has_map, icon, date_time, amount, currency, status, position
      FROM ${TABLE_NAME}
      ORDER BY position ASC
    `
  );

  return result.rows.map(rowToBlock);
}

async function listActivityRows() {
  const result = await query(
    `
      SELECT id, type, title, tabs, has_map, icon, date_time, amount, currency, status, position
      FROM ${TABLE_NAME}
      ORDER BY position ASC
    `
  );

  return result.rows.map((row) => ({
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
  }));
}

async function getActivityRow(id) {
  const result = await query(
    `
      SELECT id, type, title, tabs, has_map, icon, date_time, amount, currency, status, position
      FROM ${TABLE_NAME}
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function createActivityRow(input) {
  await query(
    `
      INSERT INTO ${TABLE_NAME} (
        id,
        type,
        title,
        tabs,
        has_map,
        icon,
        date_time,
        amount,
        currency,
        status,
        position
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
    [
      input.id,
      input.type,
      input.title || null,
      input.tabs ? JSON.stringify(input.tabs) : null,
      input.hasMap,
      input.icon || null,
      input.dateTime || null,
      input.amount === "" ? null : input.amount,
      input.currency || null,
      input.status || null,
      Number(input.position)
    ]
  );
}

async function updateActivityRow(id, input) {
  await query(
    `
      UPDATE ${TABLE_NAME}
      SET
        type = $2,
        title = $3,
        tabs = $4,
        has_map = $5,
        icon = $6,
        date_time = $7,
        amount = $8,
        currency = $9,
        status = $10,
        position = $11,
        updated_at = NOW()
      WHERE id = $1
    `,
    [
      id,
      input.type,
      input.title || null,
      input.tabs ? JSON.stringify(input.tabs) : null,
      input.hasMap,
      input.icon || null,
      input.dateTime || null,
      input.amount === "" ? null : input.amount,
      input.currency || null,
      input.status || null,
      Number(input.position)
    ]
  );
}

async function deleteActivityRow(id) {
  await query(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
}

function normalizeActivityInput(body) {
  return {
    id: String(body.id || "").trim(),
    type: String(body.type || "card").trim(),
    title: String(body.title || "").trim(),
    tabs: parseTabs(body.tabs),
    hasMap: body.hasMap === "on",
    icon: String(body.icon || "").trim(),
    dateTime: String(body.dateTime || "").trim(),
    amount: String(body.amount || "").trim(),
    currency: String(body.currency || "").trim(),
    status: String(body.status || "").trim(),
    position: String(body.position || "").trim()
  };
}

module.exports = {
  TABLE_NAME,
  ensureActivityTable,
  seedActivityTable,
  listActivityBlocks,
  listActivityRows,
  getActivityRow,
  createActivityRow,
  updateActivityRow,
  deleteActivityRow,
  normalizeActivityInput
};
