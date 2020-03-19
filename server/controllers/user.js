const {
  findUserBySession,
  getUsersTransactions,
  addTransaction,
  updateUserCash,
  getTransactionByUserId,
  updateTransactionQuantity
} = require("../models/models");

const apiHelper = require("./apiHelper");

module.exports = {
  showPortfolio: async (req, res, next) => {
    try {
      // find the user that's currently on the session and serve up their info, eager load associated transactions
      const user = await findUserBySession(req.session.user.id);
      // if this user isn't on the session, access is denied. Effectively, whichever user id you try to go to, you will only be served the info of the user on the session (this way the user can't spy on anyone!)
      if (!user) {
        res.status(401).send("access denied");
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      next(err);
    }
  },
  getLatestPriceOfStock: async (req, res, next) => {
    try {
      const tickerSymbol = req.query.ticker;
      const stock = await apiHelper.make_API_call(tickerSymbol);
      // might be more optimal to send back only the price? But this way we can make sure on the client side that we're dealing with the correct stock
      if (stock) {
        res.send(stock);
      } else {
        res
          .status(500)
          .send("unable to retrieve stock information at this time");
      }
    } catch (err) {
      next(err);
    }
  },
  showTransactions: (req, res, next) => {
    try {
      // front end will display type of transaction (buy), name of stock, quantity, and price at time of purchase
      const userTransactions = getUsersTransactions(req.session.user.id);
      res.send(userTransactions);
    } catch (err) {
      next(err);
    }
  },
  buyStock: async (req, res, next) => {
    try {
      // first, get the stock the user wants to buy
      const tickerSymbol = req.body.ticker;
      const stock = await apiHelper.make_API_call(tickerSymbol);
      if (!stock) {
        res
          .status(500)
          .send("unable to retrieve stock information at this time");
      }
      // next, make sure the user has enough cash to buy the quantity of stock they want:
      const user = await findUserBySession(req.session.user.id);
      const totalCost =
        parseInt(stock.latestPrice) * parseInt(req.body.quantity);
      // if they have enough money, update their cash
      if (user.cash >= totalCost) {
        updateUserCash(user.id, user.cash, totalCost);
        // then, add the new stock instance to the Transaction table:
        const newTransaction = addTransaction(
          req.session.user.id,
          stock,
          req.body.quantity
        );
        // finally, send back the new transaction
        if (newTransaction) {
          res.status(200).send(newTransaction);
        }
      } else {
        // if the user doesn't have enough money, send an error message
        res.status(400).send("not enough cash!");
      }
    } catch (err) {
      next(err);
    }
  },
  updateStockQuantity: async (req, res, next) => {
    try {
      // this route handles updating quantity of a stock that's already associated with the user
      // first, find the user on the session
      const user = await findUserBySession(req.session.user.id);
      // next, get the latest price of the stock they want to increase
      const { latestPrice } = await apiHelper.make_API_call(req.body.ticker);
      if (!latestPrice) {
        res
          .status(500)
          .send("unable to retrieve stock information at this time");
      } else {
        // multiply the cost of the stock by the desired quantity
        const totalCost = parseInt(latestPrice) * parseInt(req.body.quantity);
        // if they can afford this quantity of stock at its current price, update their cash
        if (user.cash >= totalCost) {
          updateUserCash(user.id, user.cash, totalCost).then(() => {
            // find the transaction with this ticker associated with this user...
            getTransactionByUserId(user.id, req.body.ticker).then(
              transaction => {
                // ...and add the new quantity of this stock
                const newQuantity =
                  parseInt(transaction.quantity) + parseInt(req.body.quantity);
                updateTransactionQuantity(
                  user.id,
                  req.body.ticker,
                  newQuantity
                ).then(() => {
                  res.sendStatus(200);
                });
              }
            );
          });
        } else {
          res.status(400).send("not enough cash!");
        }
      }
    } catch (err) {
      next(err);
    }
  }
};
