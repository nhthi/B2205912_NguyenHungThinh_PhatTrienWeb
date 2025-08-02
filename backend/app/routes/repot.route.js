const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/authJwt");
router.get("/overview", verifyToken, userController.getOverview);

module.exports = router;
