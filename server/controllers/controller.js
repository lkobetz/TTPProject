const { sufficientInput, findUser, registerUser } = require("./models/models");

module.exports = {
  main: {
    home: async (req, res) => {
      try {
        // this is supposed to log the user out if they return to the login page (the logout button sends them here)
        // it doesn't seem to actually log the user out though until their id is removed from sessionStorage on the client side
        // need to eventually store the session in the database
        if (req.session.user && req.session) {
          await req.session.destroy();
        }
        res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    },
    register: (req, res) => {
      try {
        // sufficientInput will return the req.body if it's sufficient
        const input = sufficientInput(req.body);
        if (!input) {
          res.status(400).send("Invalid Details");
        } else {
          findUser(req.body.email).then(result => {
            if (result) {
              res.status(409).send("User already exists");
            } else {
              registerUser(req.body).then(result => {
                console.log("registered user:", result);
                // should use cookies so user can stay logged in across tabs/windows
                req.session.user = result;
                req.session.save();
                // redirects to a route that serves the logged in user's info (will be blank since they just registered)
                if (result.id) {
                  res.redirect("/api/" + result.id);
                }
              });
            }
          });
        }
      } catch (err) {
        next(err);
      }
    }
  }
};
