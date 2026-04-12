const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "ecommerce",   // DB name
  "postgres",    // username
  "Buwa927",        // password (your one)
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = sequelize;
