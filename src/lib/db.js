const { Pool } = require("pg");

let pool;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

module.exports = {
  hasDatabaseUrl,
  query
};
