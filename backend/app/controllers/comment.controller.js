const CommentService = require("../services/comment.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo bình luận mới
exports.create = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const document = await commentService.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo bình luận"));
  }
};

// Lấy tất cả bình luận hoặc lọc theo tên người dùng (tùy chọn)
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const commentService = new CommentService(MongoDB.client);
    const username = req.query.username;

    if (username) {
      documents = await commentService.findByUsername(username);
    } else {
      documents = await commentService.findAll();
    }

    return res.status(200).json(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách bình luận"));
  }
};

// Lấy một bình luận theo ID
exports.findOne = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const document = await commentService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy bình luận"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất bình luận với id=${req.params.id}`)
    );
  }
};
// Lấy một bình luận theo ID
exports.findByBookId = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const document = await commentService.findByBookId(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy bình luận"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất bình luận với id=${req.params.id}`)
    );
  }
};

// Lấy một bình luận theo ID
exports.findByUserId = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const document = await commentService.findByUserId(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy bình luận"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất bình luận với id=${req.params.id}`)
    );
  }
};
// Cập nhật bình luận theo ID
exports.update = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const document = await commentService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy bình luận để cập nhật"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật bình luận với id=${req.params.id}`)
    );
  }
};

// Xóa một bình luận theo ID
exports.delete = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const document = await commentService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy bình luận để xóa"));
    }

    return res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa bình luận với id=${req.params.id}`)
    );
  }
};

// Xóa tất cả bình luận
exports.deleteAll = async (req, res, next) => {
  try {
    const commentService = new CommentService(MongoDB.client);
    const deletedCount = await commentService.deleteAll();

    return res.status(200).json({
      message: `${deletedCount} bình luận đã bị xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả bình luận"));
  }
};
