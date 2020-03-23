const {
  sufficientInput,
  findUserByEmailAndPass,
  registerUser
} = require("../models/models");

module.exports = {
  home: (req, res, next) => {
    try {
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
  register: (req, res, next) => {
    try {
      // sufficientInput will return the req.body if it's sufficient
      const input = sufficientInput(req.body);
      if (!input) {
        res.status(400).send("Invalid Details");
      } else {
        findUserByEmailAndPass(req.body).then(result => {
          if (result) {
            res.status(409).send("User already exists");
          } else {
            registerUser(req.body).then(result => {
              // should use cookies so user can stay logged in across tabs/windows
              // should save the session in the database so we can make a single loginUser function for both register and login routes
              req.session.user = result;
              req.session.save();
              // redirects to a route that serves the logged in user's info (will be blank since they just registered)
              if (result.id) {
                res.send(result);
              }
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  },
  login: (req, res, next) => {
    try {
      // sufficientInput will return the req.body if it's sufficient
      const input = sufficientInput(req.body);
      if (!input) {
        res.status(400).send("Insufficient Information");
      } else {
        findUserByEmailAndPass(req.body).then(result => {
          if (result) {
            // should use cookies so user can stay logged in across tabs/windows
            req.session.user = result;
            req.session.save();
            console.log("req.session after login:", req.session);
            // redirect to route that serves user's info (previous transactions)
            if (result.id) {
              res.send(result);
            }
          } else {
            res.status(404).send("user not found");
          }
        });
      }
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      // this is supposed to log the user out if they return to the login page (the logout button sends them here)
      // it doesn't seem to actually log the user out though until their id is removed from localStorage on the client side
      if (req.session) {
        await req.session.destroy();
      }
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
};
