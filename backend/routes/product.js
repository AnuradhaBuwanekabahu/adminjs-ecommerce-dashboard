const router = require("express").Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const auth = require("../middleware/authmiddleware");

router.get("/", auth, async (req, res) => {
  const data = await Product.findAll({ include: Category });
  res.json(data);
});

router.get("/:id", auth, async (req, res) => {
  const data = await Product.findByPk(req.params.id, { include: Category });
  res.json(data);
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, price, imageUrl, description, categoryId } = req.body;
    const product = await Product.create({ name, price, imageUrl, description, CategoryId: categoryId });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

module.exports = router;
