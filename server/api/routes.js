const router = require("express").Router();
const { Transaction } = require("../db/associations");
const { User } = require("../db/associations");

router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll();
    const user = await User.findAll();
    const transAndUser = { transactions, user };
    res.send(transAndUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
