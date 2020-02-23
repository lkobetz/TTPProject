const db = require("./db");
const User = require("./User");
const Transaction = require("./Transaction");

User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = {
  db,
  User,
  Transaction
};
