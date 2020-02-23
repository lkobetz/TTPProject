const Sequelize = require("sequelize");
const db = require("./db");

module.exports = db.define("transactions", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
