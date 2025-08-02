const ApiError = require("../api-error");
const AuthorService = require("../services/author.service");
const MongoDB = require("../utils/mongodb.util");

// Tạo mới tác giả
exports.create = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const existing = await authorService.find({ authorId: req.body.authorId });

    if (existing.length > 0) {
      return next(new ApiError(400, "Mã tác giả đã tồn tại"));
    }

    const result = await authorService.create(req.body);
    return res.status(201).json({
      message: "Tạo tác giả thành công",
      author: result.value,
    });
  } catch (error) {
    console.error("Create author error:", error);
    return next(new ApiError(500, "Đã xảy ra lỗi khi tạo tác giả"));
  }
};

// Lấy danh sách tất cả tác giả
exports.findAll = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const authors = await authorService.findAll();
    return res.send(authors);
  } catch (error) {
    console.error("Find all authors error:", error);
    return next(new ApiError(500, "Lỗi khi lấy danh sách tác giả"));
  }
};

// Tìm tác giả theo tên
exports.findByName = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const authors = await authorService.findByName(req.query.name);
    return res.send(authors);
  } catch (error) {
    console.error("Find author by name error:", error);
    return next(new ApiError(500, "Lỗi khi tìm tác giả theo tên"));
  }
};

// Tìm tác giả theo ID
exports.findById = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const author = await authorService.findById(req.params.id);

    if (!author) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    return res.send(author);
  } catch (error) {
    console.error("Find author by ID error:", error);
    return next(new ApiError(500, "Lỗi khi tìm tác giả theo ID"));
  }
};

// Cập nhật thông tin tác giả
exports.update = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const updated = await authorService.update(req.params.id, req.body);

    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    return res.send({
      message: "Cập nhật tác giả thành công",
      author: updated.value,
    });
  } catch (error) {
    console.error("Update author error:", error);
    return next(new ApiError(500, "Lỗi khi cập nhật tác giả"));
  }
};

// Xoá tác giả
exports.delete = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const result = await authorService.delete(req.params.id);

    if (!result) {
      return next(new ApiError(404, "Không tìm thấy tác giả để xoá"));
    }

    return res.send({ message: "Xoá tác giả thành công" });
  } catch (error) {
    console.error("Delete author error:", error);
    return next(new ApiError(500, "Lỗi khi xoá tác giả"));
  }
};

// Xoá tất cả tác giả
exports.deleteAll = async (req, res, next) => {
  try {
    const authorService = new AuthorService(MongoDB.client);
    const deletedCount = await authorService.deleteAll();

    return res.send({
      message: `${deletedCount} tác giả đã được xoá`,
    });
  } catch (error) {
    console.error("Delete all authors error:", error);
    return next(new ApiError(500, "Lỗi khi xoá toàn bộ tác giả"));
  }
};
