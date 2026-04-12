const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/authmiddleware");

router.get("/", auth, async (req, res) => {
  const data = await Product.findAll();
  res.json(data);
});

router.get("/:id", auth, async (req, res) => {
  const data = await Product.findByPk(req.params.id);
  res.json(data);
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body;
    const product = await Product.create({ name, price, imageUrl, description });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

module.exports = router;
