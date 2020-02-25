const router = require("express").Router();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
const { Transaction } = require("../db/associations");
const { User } = require("../db/associations");
const apiHelper = require("./apiHelper");
const { tpApiToken } = require("../../secrets");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(
  session({ secret: "change this secret later and store it in a secret place" })
);

router.get("/", async (req, res, next) => {
  try {
    res.send("this is the homepage. users can login or register");
  } catch (err) {
    next(err);
  }
});

router.get("/register", async (req, res, next) => {
  try {
    res.send("registration page");
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.password) {
      res.status("400");
      res.send("Invalid details!");
    } else {
      const foundUser = await User.findOne({
        where: {
          name: req.body.name,
          password: req.body.password
        }
      });
      if (foundUser) {
        res.send("user already exists");
      } else {
        const newUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        req.session.user = newUser;
        const userId = newUser.id;
        res.redirect("/api/:userId");
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get("/login", async (req, res, next) => {
  try {
    res.send("login page");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.password) {
      res.status("400");
      res.send("Invalid details!");
    } else {
      const foundUser = await User.findOne({
        where: {
          name: req.body.name,
          password: req.body.password
        }
      });
      if (foundUser) {
        req.session.user = foundUser;
        res.redirect("/api/" + req.session.user.id);
      } else {
        res.send("user not found");
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // verify that username and password match
    // the front end will display name, quantity, and total price of all stocks owned by user
    const user = await User.findOne({
      where: {
        id: req.session.user.id
      }
    });
    const userStocks = await Transaction.findAll({
      where: {
        userId: user.id
      }
    });
    // on the front end, make an api request for each stock to get its current price
    res.send(userStocks);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/transactions", async (req, res, next) => {
  try {
    // front end will display type of transaction (buy), name of stock, quantity, and price at time of purchase
    const userTransactions = await Transaction.findAll({
      where: {
        userId: user.id
      }
    });
    res.send(userTransactions);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/transactions", async (req, res, next) => {
  try {
    // production is mounted on: https://cloud.iexapis.com/
    // save the result of the api call as stockToAdd
    const tickerSymbol = req.body.ticker;
    const url = `https://sandbox.iexapis.com/stable/stock/${tickerSymbol}/quote/?token=${tpApiToken}&period=annual`;
    const stockToAdd = await apiHelper
      .make_API_call(url)
      // the following will send the entire stockToAdd object
      // .then(response => {
      //   res.json(response);
      // })
      .catch(error => {
        res.send(error);
      });
    const newTransaction = await Transaction.create({
      name: stockToAdd.symbol,
      price: stockToAdd.latestPrice,
      quantity: req.body.quantity,
      // change the following to req.session.user.id
      userId: req.params.id
    });
    res.send(newTransaction);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
