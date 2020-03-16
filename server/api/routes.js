const router = require("express").Router();
const mainController = require("../controllers/main");
const userController = require("../controllers/user");

router.get("/", mainController.home);

router.post("/register", mainController.register);

router.post("/login", mainController.login);

router.get("/:id", userController.showPortfolio);

router.get("/:id/apicall", userController.getLatestPriceOfStock);

router.get("/:id/transactions", userController.showTransactions);

router.post("/:id", userController.buyStock);

router.put("/:id", userController.updateStockQuantity);

module.exports = router;
