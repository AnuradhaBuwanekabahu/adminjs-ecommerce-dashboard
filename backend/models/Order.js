const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Order = sequelize.define("Order", {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Order.belongsTo(User);

module.exports = Order;
