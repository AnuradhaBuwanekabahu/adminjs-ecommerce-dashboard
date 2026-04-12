const router = require("express").Router();
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const auth = require("../middleware/authmiddleware");

// Fetch logged in user's orders
router.get("/", auth, async (req, res) => {
  const orders = await Order.findAll({
    where: { UserId: req.user.id },
    include: [
      {
        model: OrderItem,
        include: [Product]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  res.json(orders);
});

router.post("/", auth, async (req, res) => {
  const { items } = req.body; // Expects an array: [{ productId, quantity }]

  if (!items || items.length === 0) {
    return res.status(400).send("No items in order");
  }

  let grandTotal = 0;
  const processedItems = [];

  // Verify prices securely from DB
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (product) {
      grandTotal += product.price * item.quantity;
      processedItems.push({
        ProductId: product.id,
        quantity: item.quantity
      });
    }
  }

  if (processedItems.length === 0) {
    return res.status(400).send("Valid products not found");
  }

  // Create Master Order
  const order = await Order.create({
    total: grandTotal,
    UserId: req.user.id
  });

  // Bulk create OrderItems
  for (const pItem of processedItems) {
    await OrderItem.create({
      OrderId: order.id,
      ProductId: pItem.ProductId,
      quantity: pItem.quantity
    });
  }

  res.json({ message: "Order successfully placed" });
});

module.exports = router;

