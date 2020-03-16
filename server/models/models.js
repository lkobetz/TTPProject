const { Transaction, User } = require("../db/associations");

module.exports = {
  sufficientInput: input => {
    if (!input.name && input.email && input.password) {
      return false;
    } else {
      return true;
    }
  },
  findUserByEmailAndPass: async input => {
    const foundUser = await User.findOne({
      where: {
        email: input.email,
        password: input.password
      }
    });
    return foundUser;
  },
  findUserBySession: async sessionId => {
    const user = await User.findOne({
      where: {
        id: sessionId
      },
      include: {
        model: Transaction
      }
    });
    return user;
  },
  registerUser: async input => {
    const newUser = await User.create({
      name: input.name,
      email: input.email,
      password: input.password
    });
    return newUser;
  },
  getUsersTransactions: async sessionId => {
    const userTransactions = await Transaction.findAll({
      where: {
        userId: sessionId
      }
    });
    return userTransactions;
  },
  addTransaction: async (userId, stock, quantity) => {
    const newTransaction = await Transaction.create({
      name: stock.symbol,
      price: stock.latestPrice,
      quantity: quantity,
      userId: userId
    });
    return newTransaction;
  },
  updateUserCash: async (cash, cost) => {
    // subtract the current price of the stock * desired quantity from the user's cash
    const updatedCash = cash - cost;
    const updatedUser = await user.update({
      cash: updatedCash
    });
    return updatedUser;
  }
};
