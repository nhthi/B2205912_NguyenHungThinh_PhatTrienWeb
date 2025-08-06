const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const payload = { ...req.body, ngay_tao: new Date() };
    const document = await bookService.create(payload);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Không thể tạo sách"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { title } = req.query;
    const categoryId = req.query.category;
    if (title) {
      documents = await bookService.findByTitle(title);
    } else {
      documents = await bookService.findAll(categoryId);
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất sách id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách để cập nhật"));
    }

    return res.send({ message: "Cập nhật sách thành công", document });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sách id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách để xoá"));
    }

    return res.send({ message: "Xoá sách thành công" });
  } catch (error) {
    return next(new ApiError(500, `Không thể xoá sách id=${req.params.id}`));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();

    return res.send({
      message: `${deletedCount} sách đã được xoá`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xoá toàn bộ sách"));
  }
};

exports.findWithDetails = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const books = await bookService.findWithDetails();
    return res.send(books);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách sách chi tiết"));
  }
};
