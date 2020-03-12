const router = require("express").Router();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
const { Transaction } = require("../db/associations");
const { User } = require("../db/associations");
const apiHelper = require("./apiHelper");
// use secrets file for development and process.env vars for production
const { tpApiToken, sessionSecret } = require("../../secrets");
// const tpApiToken = process.env.pApiToken;
// const sessionSecret = process.env.sessionSecret;

// parses the req.body from the forms
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// haven't actually set up cookies yet
router.use(cookieParser());
// logged-in user is stored on the session
router.use(session({ secret: sessionSecret }));

router.get("/", async (req, res, next) => {
  try {
    // this is supposed to log the user out if they return to the login page (the logout button sends them here)
    // it doesn't seem to actually log the user out though until their id is removed from sessionStorage on the client side
    if (req.session.user && req.session) {
      await req.session.destroy();
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    // checks if the user inputted a name and password
    if (!req.body.name || !req.body.password || !req.body.email) {
      res.status("400").send("Invalid details!");
    } else {
      // see if the inputted email address has already been used (additionally, the email field in the model is set to unique)
      const foundUser = await User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (foundUser) {
        res.status(401).send("user already exists");
      } else {
        const newUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // should use cookies so user can stay logged in across tabs/windows
        req.session.user = newUser;
        req.session.save();
        // redirects to a route that serves the logged in user's info (will be blank since they just registered)
        if (newUser.id) {
          res.redirect("/api/" + newUser.id);
        }
      }
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.password || !req.body.email) {
      res.status("400").send("Invalid details!");
    } else {
      const foundUser = await User.findOne({
        where: {
          name: req.body.name,
          password: req.body.password,
          email: req.body.email
        }
      });
      if (foundUser) {
        // should use cookies so user can stay logged in across tabs/windows
        req.session.user = foundUser;
        req.session.save();
        // redirect to route that serves user's info (previous transactions)
        if (foundUser.id) {
          res.redirect("/api/" + foundUser.id);
        }
      } else {
        res.status(404).send("user not found");
      }
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // find the user that's currently on the session and serve up their info, eager load associated transactions
    const user = await User.findOne({
      where: {
        id: req.session.user.id
      },
      include: {
        model: Transaction
      }
    });
    // if this user isn't on the session, access is denied. Effectively, whichever user id you try to go to, you will only be served the info of the user on the session (this way the user can't spy on anyone!)
    if (!user) {
      req.status(401).send("access denied");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    next(err);
  }
});

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
