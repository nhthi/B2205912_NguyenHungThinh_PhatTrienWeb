const express = require("express");
const router = express.Router();
const authorController = require("../controllers/author.controller");
const verifyToken = require("../middlewares/authJwt");

router.post("/", verifyToken, authorController.create);
router.get("/", authorController.findAll);
router.get("/search", authorController.findByName);
router.get("/:id", authorController.findById);
router.put("/:id", verifyToken, authorController.update);
router.delete("/:id", verifyToken, authorController.delete);
router.delete("/", verifyToken, authorController.deleteAll);

module.exports = router;
