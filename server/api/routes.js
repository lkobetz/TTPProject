const router = require("express").Router();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
const { Transaction } = require("../db/associations");
const { User } = require("../db/associations");
const apiHelper = require("./apiHelper");
const { tpApiToken, sessionSecret } = require("../../secrets");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(session({ secret: sessionSecret }));

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
        res.redirect("/api/" + req.session.user.id);
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

router.post("/logout", async (req, res, next) => {
  try {
    session.destroy();
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
      },
      include: {
        model: Transaction
      }
    });
    if (!user) {
      req.send("access denied");
    } else {
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id/apicall", async (req, res, next) => {
  console.log(req.body);
  const tickerSymbol = req.body.ticker;
  const url = `https://sandbox.iexapis.com/stable/stock/${tickerSymbol}/quote/?token=${tpApiToken}&period=annual`;
  const stock = await apiHelper
    .make_API_call(url)
    // the following will send the entire stockToAdd object
    // .then(response => {
    //   res.json(response);
    // })
    .catch(error => {
      res.send(error);
    });
  res.send(stock);
});

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

router.post("/:id", async (req, res, next) => {
  try {
    // production is mounted on: https://cloud.iexapis.com/
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
    const user = await User.findOne({
      where: {
        id: req.body.user.id
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
      res.send(newTransaction);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    // if the user already owns stock by this name, increment the quantity of the pre-existing stock
    const transaction = await Transaction.findOne({
      where: {
        userId: req.body.user.id,
        name: req.body.ticker
      }
    });
    const formerQuantity = transaction.quantity;
    const newQuantity = parseInt(formerQuantity) + parseInt(req.body.quantity);
    await transaction.update({
      quantity: newQuantity
    });
    // handle the user's payment
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
    const user = await User.findOne({
      where: {
        id: req.body.user.id
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
      // is 400 the right status?
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
