const express = require("express");
const publisherController = require("../controllers/publisher.controller");
const verifyToken = require("../middlewares/authJwt");

const router = express.Router();

router
  .route("/")
  .get(publisherController.findAll) // Lấy danh sách nhà xuất bản
  .post(verifyToken, publisherController.create) // Tạo nhà xuất bản mới
  .delete(verifyToken, publisherController.deleteAll); // Xoá toàn bộ nhà xuất bản

router
  .route("/:id")
  .get(publisherController.findOne) // Lấy nhà xuất bản theo ID
  .put(verifyToken, publisherController.update) // Cập nhật nhà xuất bản
  .delete(verifyToken, publisherController.delete); // Xoá nhà xuất bản theo ID

module.exports = router;
