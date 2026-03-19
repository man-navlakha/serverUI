const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", "..", ".env")
});

const {
  TABLE_NAME,
  ensureActivityTable,
  seedActivityTable
} = require("../lib/activityRepository");

async function run() {
  await ensureActivityTable();
  await seedActivityTable();
  console.log(`Table "${TABLE_NAME}" is ready and seeded.`);
}

run()
  .catch((error) => {
    console.error("Database init failed:", error.message);
    process.exitCode = 1;
  });
