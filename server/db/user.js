const Sequelize = require("sequelize");
const db = require("./db.js");

module.exports = db.define("users", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cash: {
    type: Sequelize.INTEGER,
    defaultValue: 5000
  }
});
