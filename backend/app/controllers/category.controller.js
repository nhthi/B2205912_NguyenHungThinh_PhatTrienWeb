const CategoryService = require("../services/category.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo một đối tượng controller cho Category
exports.create = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo danh mục"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const categoryService = new CategoryService(MongoDB.client);
    const name = req.query.name;

    if (name) {
      documents = await categoryService.findByName(name);
    } else {
      documents = await categoryService.findAll();
    }

    return res.status(200).json(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách danh mục"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy danh mục"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất danh mục với id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy danh mục để cập nhật"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật danh mục với id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const document = await categoryService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy danh mục để xóa"));
    }

    return res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa danh mục với id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const categoryService = new CategoryService(MongoDB.client);
    const deletedCount = await categoryService.deleteAll();

    return res.status(200).json({
      message: `${deletedCount} danh mục đã bị xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả danh mục"));
  }
};
