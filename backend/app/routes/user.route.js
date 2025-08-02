const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/authJwt");
router.get("/", verifyToken, userController.getAllUser);
router.get("/profile", verifyToken, userController.getProfile);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.put("/:id", verifyToken, userController.update);
router.get("/:id", verifyToken, userController.getById);
router.delete("/:id", verifyToken, userController.deleteById);

module.exports = router;
