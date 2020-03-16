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
  }
};
