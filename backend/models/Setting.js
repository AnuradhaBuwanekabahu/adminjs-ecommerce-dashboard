const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Setting = sequelize.define("Setting", {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT, // better than STRING for flexibility
    allowNull: false,
  },
});

module.exports = Setting;
