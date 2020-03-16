const { findUserBySession } = require("../models/models");

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
  }
};
