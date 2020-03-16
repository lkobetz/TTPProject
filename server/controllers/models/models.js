const { Transaction, User } = require("../../db/associations");

module.exports = {
  sufficientInput: input => {
    if (!input.name && input.email && input.password) {
      return false;
    } else {
      return true;
    }
  },
  findUser: async email => {
    const foundUser = await User.findOne({
      where: {
        email: email
      }
    });
    return foundUser;
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
