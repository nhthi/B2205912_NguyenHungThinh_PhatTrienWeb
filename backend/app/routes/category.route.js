const express = require("express");
const categoryController = require("../controllers/category.controller");
const verifyToken = require("../middlewares/authJwt");
const router = express.Router();

router.post("/", verifyToken, categoryController.create);
router.get("/", categoryController.findAll);
router.get("/:id", categoryController.findOne);
router.put("/:id", verifyToken, categoryController.update);
router.delete("/:id", verifyToken, categoryController.delete);
router.delete("/", verifyToken, categoryController.deleteAll);

module.exports = router;
