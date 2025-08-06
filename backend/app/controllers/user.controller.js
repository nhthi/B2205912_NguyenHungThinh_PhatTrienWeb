const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");

const JWT_SECRET = process.env.JWT_SECRET || "library_staff_secret";

exports.register = async (req, res, next) => {
  const {
    ho_ten,
    so_dien_thoai,
    dia_chi,
    email,
    mat_khau,
    trang_thai,
    vai_tro,
  } = req.body;

  if (!ho_ten || !email || !mat_khau) {
    return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin bắt buộc"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const existing = await userService.find({
      $or: [{ email }],
    });

    if (existing.length > 0) {
      return next(new ApiError(400, "Email người dùng đã tồn tại"));
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    const newUser = {
      ho_ten,
      so_dien_thoai,
      dia_chi,
      email,
      mat_khau: hashedPassword,
      trang_thai,
      vai_tro,
    };

    const result = await userService.create(newUser);
    return res.status(201).json({
      message: "Đăng ký người dùng thành công",
      user: result.value,
    });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi đăng ký người dùng"));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Email và mật khẩu là bắt buộc"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const userList = await userService.find({ email });

    if (userList.length === 0) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }

    const user = userList[0];
    const isMatch = await bcrypt.compare(password, user.mat_khau);

    if (!isMatch) {
      return next(new ApiError(401, "Mật khẩu không đúng"));
    }

    if (user.trang_thai !== "active") {
      return next(new ApiError(401, "Tài khoản của bạn đang bị khóa!!!"));
    }

    const token = jwt.sign({ id: user._id, role: user.vai_tro }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.send({
      token,
      user: {
        id: user._id,
        name: user.ho_ten,
        email: user.email,
        role: user.vai_tro,
      },
    });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi đăng nhập"));
  }
};

// Cập nhật thông tin người dùng
exports.update = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const currentUser = await userService.findById(req.params.id);
    if (!currentUser) {
      return next(new ApiError(404, "User not found"));
    }
    // 2. Nếu email được cập nhật và khác với email hiện tại, kiểm tra xem đã tồn tại chưa
    if (req.body.email && req.body.email !== currentUser.email) {
      const emailExists = await userService.findByEmail(req.body.email);
      if (emailExists) {
        return next(
          new ApiError(400, "Email đã được sử dụng bởi người dùng khác")
        );
      }
    }
    const updated = await userService.update(req.params.id, req.body);

    if (!updated) {
      return next(new ApiError(404, "User not found"));
    }

    return res.send({ message: "User updated successfully", data: updated });
  } catch (error) {
    console.error("Update error:", error);
    return next(new ApiError(500, "An error occurred while updating the user"));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);

    const user = await userService.findById(req.id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.send(user);
  } catch (error) {
    console.error("Find by ID error:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving the user")
    );
  }
};

exports.getById = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const user = await userService.findById(req.params.id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.send(user);
  } catch (error) {
    console.error("Find by ID error:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving the user")
    );
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const id = req.params.id;

    const user = await userService.findById(id);
    if (!user) {
      return next(new ApiError(404, "User không tồn tại"));
    }

    await userService.delete(id); // đổi tên cho rõ nghĩa
    return res.status(200).json({
      message: "Xoá người dùng thành công",
    });
  } catch (error) {
    console.error("Lỗi xoá user:", error);
    return next(new ApiError(500, "Lỗi khi xoá user"));
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const userList = await userService.findAll();

    return res.send(userList);
  } catch (error) {
    console.error("Get all user error:", error);
    return next(
      new ApiError(500, "An error occurred while retrieving user list")
    );
  }
};

exports.getOverview = async (req, res, next) => {
  try {
    const dashboardService = new UserService(MongoDB.client); // tuỳ bạn đặt tên
    const overview = await dashboardService.overview();
    res.send(overview);
  } catch (error) {
    next(new ApiError(500, "An error occurred while getting overview"));
  }
};
