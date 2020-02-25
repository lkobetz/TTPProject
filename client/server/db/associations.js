const User = require("./models/User");
const Transaction = require("./models/Transaction");

User.hasMany(Transaction);
Transaction.belongsTo(User);

module.exports = {
  User,
  Transaction
};
