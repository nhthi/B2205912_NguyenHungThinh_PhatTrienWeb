const BorrowService = require("../services/borrow.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const payload = {
      ...req.body,
      ngay_muon: req.body.ngay_muon ? new Date(req.body.ngay_muon) : new Date(),
      han_tra: req.body.han_tra ? new Date(req.body.han_tra) : null,
    };
    const document = await borrowService.create(payload);
    return res.status(201).json(document);
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi khi tạo phiếu mượn"));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const documents = await borrowService.findAll();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách phiếu mượn"));
  }
};

exports.findAllWithDetails = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const documents = await borrowService.findWithDetails();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách phiếu mượn"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm phiếu mượn"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const payload = {
      ...req.body,
      ngay_muon: req.body.ngay_muon ? new Date(req.body.ngay_muon) : new Date(),
      han_tra: req.body.han_tra ? new Date(req.body.han_tra) : null,
      ngay_tra_thuc_te: req.body.ngay_tra_thuc_te
        ? new Date(req.body.ngay_tra_thuc_te)
        : null,
    };
    const document = await borrowService.update(req.params.id, payload);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật phiếu mượn"));
  }
};

exports.approve = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const payload = {
      ...req.body,
    };
    const document = await borrowService.update(req.params.id, payload);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật phiếu mượn"));
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.returnBook(
      req.params.id,
      req.body.ngay_tra_thuc_te
    );
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi trả sách"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn để xoá"));
    }
    return res.send({ message: "Xoá thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xoá phiếu mượn"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const deletedCount = await borrowService.deleteAll();
    return res.send({ message: `${deletedCount} phiếu mượn đã được xoá` });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xoá tất cả phiếu mượn"));
  }
};

exports.findByUserId = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);

    const borrows = await borrowService.find({ ma_doc_gia: req.params.userId });

    return res.send(borrows);
  } catch (error) {
    console.error("FindByUserId Error:", error);
    return next(new ApiError(500, "Lỗi khi tìm lượt mượn của người dùng"));
  }
};
