const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    res.send("we have entered a get route!");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
