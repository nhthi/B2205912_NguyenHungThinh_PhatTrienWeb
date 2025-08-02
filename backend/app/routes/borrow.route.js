const express = require("express");
const borrowController = require("../controllers/borrow.controller");
const verifyToken = require("../middlewares/authJwt");

const router = express.Router();

router
  .route("/")
  .get(verifyToken, borrowController.findAllWithDetails)
  .post(verifyToken, borrowController.create)
  .delete(verifyToken, borrowController.deleteAll);

router
  .route("/:id")
  .get(borrowController.findOne)
  .put(verifyToken, borrowController.update)
  .delete(verifyToken, borrowController.delete);

// Route để trả sách
router.route("/:id/return").put(verifyToken, borrowController.returnBook);
router.get("/user/:userId", borrowController.findByUserId);

module.exports = router;
