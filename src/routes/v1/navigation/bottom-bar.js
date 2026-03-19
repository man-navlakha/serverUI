const express = require("express");
const { defaultBottomBarConfig, tabs } = require("../../../data/bottomBarConfig");

const router = express.Router();

const validTabs = new Set(tabs.map((tab) => tab.key));

router.get("/", (req, res) => {
  const requestedActive = String(req.query.active || "Home").trim();
  const active = validTabs.has(requestedActive) ? requestedActive : "Home";

  res.json({
    ...defaultBottomBarConfig,
    active,
    tabs: tabs.map((tab) => ({
      ...tab,
      isActive: tab.key === active,
      color: tab.key === active ? defaultBottomBarConfig.activeColor : defaultBottomBarConfig.inactiveColor
    }))
  });
});

module.exports = router;
