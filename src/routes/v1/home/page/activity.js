const express = require("express");
const {
  ensureActivityTable,
  listActivityBlocks,
  seedActivityTable
} = require("../../../../lib/activityRepository");
const { activityPageSeed } = require("../../../../data/activityPageSeed");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await ensureActivityTable();
    await seedActivityTable();
    const blocks = await listActivityBlocks();
    res.json(blocks);
  } catch (error) {
    res.json(activityPageSeed);
  }
});

module.exports = router;
