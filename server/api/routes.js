const router = require("express").Router();
const mainController = require("../controllers/main");
const userController = require("../controllers/user");

// these are only here temporarily before I finish moving everything to the controller
const { Transaction, User } = require("../db/associations");

const apiHelper = require("../controllers/apiHelper");
router.get("/", mainController.home);

router.post("/register", mainController.register);

router.post("/login", mainController.login);

router.get("/:id", userController.showPortfolio);

router.get("/:id/apicall", userController.getLatestPriceOfStock);

router.get("/:id/transactions", userController.showTransactions);

router.post("/:id", userController.buyStock);

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
