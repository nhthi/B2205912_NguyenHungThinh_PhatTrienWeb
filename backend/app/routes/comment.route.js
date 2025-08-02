const express = require("express");
const commentController = require("../controllers/comment.controller");
const verifyToken = require("../middlewares/authJwt");

const router = express.Router();

// Tạo bình luận mới
router.post("/", verifyToken, commentController.create);

// Lấy tất cả bình luận (có thể lọc theo bài viết hoặc người dùng)
router.get("/", commentController.findAll);
router.get("/books/:id", commentController.findByBookId);
router.get("/users/:id", commentController.findByUserId);

// Lấy một bình luận theo ID
router.get("/:id", commentController.findOne);

// Cập nhật bình luận theo ID
router.put("/:id", verifyToken, commentController.update);

// Xoá một bình luận theo ID
router.delete("/:id", verifyToken, commentController.delete);

// Xoá tất cả bình luận
router.delete("/", verifyToken, commentController.deleteAll);

module.exports = router;
