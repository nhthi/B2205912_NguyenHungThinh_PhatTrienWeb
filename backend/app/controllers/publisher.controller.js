const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Tên nhà xuất bản không được để trống"));
  }

  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi tạo nhà xuất bản"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const publisherService = new PublisherService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await publisherService.findByName(name);
    } else {
      documents = await publisherService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách nhà xuất bản")
    );
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất nhà xuất bản id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhà xuất bản id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const document = await publisherService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Xoá thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xoá nhà xuất bản id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const publisherService = new PublisherService(MongoDB.client);
    const deletedCount = await publisherService.deleteAll();
    return res.send({
      message: `${deletedCount} nhà xuất bản đã được xoá`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "Đã xảy ra lỗi khi xoá toàn bộ nhà xuất bản")
    );
  }
};
