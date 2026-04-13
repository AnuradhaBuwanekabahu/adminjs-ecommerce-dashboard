const router = require("express").Router();
const Category = require("../models/Category");
const auth = require("../middleware/authmiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

module.exports = router;
