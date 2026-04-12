const express = require("express");
const app = express();
const cors = require("cors");

const sequelize = require("./config/db");

const authRoutes = require("./routes/auth");
const signupRoutes = require("./routes/signup");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const settingRoutes = require("./routes/setting");
const setupAdmin = require("./admin/admin");

app.use(cors());
app.use(express.json());

app.use("/api/login", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", settingRoutes);

const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const Setting = require("./models/Setting");

// Define missing associations cleanly here
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

sequelize.sync({ alter: true }).then(async () => {
  // Admin panel
  const adminRouter = await setupAdmin();
  app.use("/admin", adminRouter);

  app.listen(5000, () => console.log("Server running on port 5000"));
});
