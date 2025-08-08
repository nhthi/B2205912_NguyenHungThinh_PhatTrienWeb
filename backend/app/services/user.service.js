const { ObjectId } = require("mongodb");
const MongoDB = require("../utils/mongodb.util");

class UserService {
  constructor(client) {
    this.User = client.db().collection("nguoidung");
    this.Book = client.db().collection("sach");
    this.Borrow = client.db().collection("theodoimuonsach");
  }

  extractUserData(payload) {
    const user = {
      ho_ten: payload.ho_ten,
      email: payload.email,
      so_dien_thoai: payload.so_dien_thoai,
      mat_khau: payload.mat_khau,
      dia_chi: payload.dia_chi,
      vai_tro: payload.vai_tro ?? "reader",
      trang_thai: payload.trang_thai ?? "active",
      ngay_tao: new Date(),
      anh_dai_dien: payload.avatar || null,
    };

    // Xoá các trường undetien_phatd
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async create(payload) {
    const user = this.extractUserData(payload);
    const result = await this.User.findOneAndUpdate(
      { email: user.email },
      { $set: user },
      { returnDocument: "after", upsert: true }
    );
    console.log(result);

    return result;
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      ho_ten: { $regex: new RegExp(name, "i") },
    });
  }

  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractUserData(payload);
    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.User.deleteMany({});
    return result.deletedCount;
  }

  async findByEmail(email) {
    if (!email) return null;
    return await this.User.findOne({ email: email.toLowerCase() });
  }

  async findAll() {
    try {
      return await this.User.find({}).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  async overview() {
    try {
      // Tính ngày bắt đầu và kết thúc cho thống kê 7 ngày gần đây (không tính hôm nay)
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 7); // 7 ngày trước
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() - 1); // hôm qua
      endDate.setHours(23, 59, 59, 999);
      // Tính tổng tiền phạt bằng aggregate + toArray()
      const totalFinesResult = await this.Borrow.aggregate([
        {
          $group: {
            _id: null,
            totalFine: { $sum: "$tien_phat" },
          },
        },
      ]).toArray();
      // Thực hiện các tác vụ còn lại song song
      const [
        totalReaders,
        totalBooks,
        totalBorrows,
        recentUsers,
        recentBooks,
        borrowStatsLast7Days,
      ] = await Promise.all([
        this.User.countDocuments({ vai_tro: "reader" }), // Tổng số độc giả
        this.Book.countDocuments(), // Tổng số sách
        this.Borrow.countDocuments(), // Tổng số đơn mượn
        this.User.find({ vai_tro: "reader" }) // 5 người dùng gần đây
          .sort({ ngay_tao: -1 })
          .limit(5)
          .toArray(),
        this.Book.aggregate([
          // Lấy 5 sách mới và join thêm tên tác giả, thể loại
          { $sort: { ngay_tao: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "tacgia",
              localField: "ma_tac_gia",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: {
              path: "$author",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "theloai",
              localField: "ma_the_loai",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: {
              path: "$category",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              ten_sach: 1,
              ngay_tao: 1,
              "author.ho_ten": 1,
              "category.ten_the_loai": 1,
            },
          },
        ]).toArray(),
        this.Borrow.aggregate([
          {
            $match: {
              ngay_muon: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $project: {
              ngay_muon: {
                $dateToString: { format: "%Y-%m-%d", date: "$ngay_muon" },
              },
            },
          },
          {
            $group: {
              _id: "$ngay_muon",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]).toArray(),
      ]);
      return {
        totalReaders,
        totalBooks,
        totalBorrows,
        totalFines: totalFinesResult[0]?.totalFine || 0,
        recentUsers,
        recentBooks,
        borrowStatsLast7Days,
      };
    } catch (error) {
      console.error("Error in overview:", error);
      throw error;
    }
  }
}

module.exports = UserService;
