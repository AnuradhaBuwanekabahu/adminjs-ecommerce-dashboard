const router = require("express").Router();
const Setting = require("../models/Setting");

router.get("/", async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load settings" });
  }
});

router.get("/:key", async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: req.params.key } });
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load setting" });
  }
});

module.exports = router;
