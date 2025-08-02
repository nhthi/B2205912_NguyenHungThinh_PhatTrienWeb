const express = require("express");
const bookController = require("../controllers/book.controller");
const verifyToken = require("../middlewares/authJwt");

const router = express.Router();

// Lấy tất cả sách (basic)
router.get("/", bookController.findAll);

// Lấy tất cả sách có chi tiết (author, publisher, category)
router.get("/details", bookController.findWithDetails);

// Tạo sách mới (cần đăng nhập)
router.post("/", verifyToken, bookController.create);

// Xoá toàn bộ sách (cần đăng nhập)
router.delete("/", verifyToken, bookController.deleteAll);

// Lấy sách theo ID
router.get("/:id", bookController.findOne);

// Cập nhật sách theo ID (cần đăng nhập)
router.put("/:id", verifyToken, bookController.update);

// Xoá sách theo ID (cần đăng nhập)
router.delete("/:id", verifyToken, bookController.delete);

module.exports = router;
