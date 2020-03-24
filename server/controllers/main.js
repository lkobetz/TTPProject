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
            req.session.user = result;
            req.session.save();
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
      if (req.session) {
        await req.session.destroy();
      }
      // is this necessary?
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
};
