const router = require("express").Router();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
const { Transaction } = require("../db/associations");
const { User } = require("../db/associations");

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
    if (!req.body.id || !req.body.password) {
      res.status("400");
      res.send("Invalid details!");
    } else {
      const foundUser = await User.findOne({
        where: {
          id: req.body.id
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
        res.redirect("/:userId");
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
    // req.body includes ticker name from form and
    // call the api database and request info for the stock with the passed in ticker name?
    // sandbox testing: https://sandbox.iexapis.com/stable/stock/{tickersymbol}/financials/?token=pk_992c29e7c7ed4ee7b2f99343aab3d4f4&period=annual
    // production is mounted on: https://cloud.iexapis.com/
    // save the result of the api call as stockToAdd
    const newTransaction = await Transaction.create({
      name: req.body.name,
      price: stockToAdd.price,
      quantity: req.body.quantity,
      userId: req.user.id
    });
    res.send(newTransaction);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
