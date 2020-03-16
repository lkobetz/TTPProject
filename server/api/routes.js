const router = require("express").Router();
const mainController = require("../controllers/main");
const userController = require("../controllers/user");

// these are only here temporarily before I finish moving everything to the controller
const { Transaction, User } = require("../db/associations");

const apiHelper = require("./apiHelper");
// use secrets file for development and process.env vars for production
const { tpApiToken } = require("../../secrets");
// const tpApiToken = process.env.pApiToken;
// const sessionSecret = process.env.sessionSecret;

router.get("/", mainController.home);

router.post("/register", mainController.register);

router.post("/login", mainController.login);

router.get("/:id", userController.showPortfolio);

// router.get('/:id/apicall', controller.user.getLatestPriceOfStock)
router.get("/:id/apicall", async (req, res, next) => {
  // this route serves the purpose of getting the latestPrice of a single stock
  // since we're making a get request, we need to use req.query instead of req.body
  const tickerSymbol = req.query.ticker;
  const url = `https://cloud.iexapis.com/stable/stock/${tickerSymbol}/quote/?token=${tpApiToken}&period=annual`;
  const stock = await apiHelper
    .make_API_call(url)
    // the following will send the entire stockToAdd object, useful for debugging
    // .then(response => {
    //   res.json(response);
    // })
    .catch(error => {
      res.send(error);
    });
  // might be more optimal to send back only the price? But this way we can make sure on the client side that we're dealing with the correct stock
  res.send(stock);
});

// router.get('/:id/transactions', controller.user.showTransactions)
router.get("/:id/transactions", async (req, res, next) => {
  try {
    // front end will display type of transaction (buy), name of stock, quantity, and price at time of purchase
    const userTransactions = await Transaction.findAll({
      where: {
        userId: req.session.user.id
      }
    });
    res.send(userTransactions);
  } catch (err) {
    next(err);
  }
});

// router.post('/:id', controller.user.buyStock)
router.post("/:id", async (req, res, next) => {
  try {
    // production is mounted on: https://cloud.iexapis.com/
    // test is mounted on: https://sandbox.iexapis.com/
    // user types in the ticker symbol of the stock they want, we search for it here
    const tickerSymbol = req.body.ticker;
    const url = `https://cloud.iexapis.com/stable/stock/${tickerSymbol}/quote/?token=${tpApiToken}&period=annual`;
    const stockToAdd = await apiHelper
      .make_API_call(url)
      // the following will send the entire stockToAdd object
      // .then(response => {
      //   res.json(response);
      // })
      .catch(error => {
        res.send(error);
      });
    // posts a new instance in the Transaction table
    const newTransaction = await Transaction.create({
      name: stockToAdd.symbol,
      price: stockToAdd.latestPrice,
      quantity: req.body.quantity,
      userId: req.session.user.id
    });
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    // subtract the current price of the stock * desired quantity from the user's cash
    const cash = parseInt(user.cash);
    const price = parseInt(stockToAdd.latestPrice);
    const quantity = parseInt(req.body.quantity);
    const updatedCash = cash - price * quantity;
    const updatedUser = await user.update({
      cash: updatedCash
    });
    // but only send the transaction through if the user can afford it
    if (updatedUser.cash > 0) {
      res.status(200).send(newTransaction);
    } else {
      res.status(400).send("not enough cash!");
    }
  } catch (err) {
    next(err);
  }
});

// router.put('/:id, controller.user.updateStockQuantity)
router.put("/:id", async (req, res, next) => {
  // this route handles updating quantity of a stock that's already associated with the user
  try {
    // first, find the transaction with this ticker name that's associated with the logged in user
    const transaction = await Transaction.findOne({
      where: {
        userId: req.body.user.id,
        name: req.body.ticker
      }
    });
    // update the quantity
    const formerQuantity = transaction.quantity;
    const newQuantity = parseInt(formerQuantity) + parseInt(req.body.quantity);
    await transaction.update({
      quantity: newQuantity
    });
    // handle the user's payment
    const tickerSymbol = req.body.ticker;
    const url = `https://cloud.iexapis.com/stable/stock/${tickerSymbol}/quote/?token=${tpApiToken}&period=annual`;
    const stockToAdd = await apiHelper
      .make_API_call(url)
      // the following will send the entire stockToAdd object
      // .then(response => {
      //   res.json(response);
      // })
      .catch(error => {
        res.send(error);
      });
    // update the cash of the user on the session
    const user = await User.findOne({
      where: {
        id: req.session.user.id
      }
    });
    const cash = parseInt(user.cash);
    const price = parseInt(stockToAdd.latestPrice);
    const quantity = parseInt(req.body.quantity);
    const updatedCash = cash - price * quantity;
    const updatedUser = await user.update({
      cash: updatedCash
    });
    if (updatedUser.cash > 0) {
      res.sendStatus(200);
    } else {
      res.status(400).send("not enough cash!");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
