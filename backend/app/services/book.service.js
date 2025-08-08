const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Borrow = client.db().collection("theodoimuonsach");
    this.Book = client.db().collection("sach");
  }

  extractBookData(payload) {
    const book = {
      ten_sach: payload.ten_sach,
      ma_nxb: payload.ma_nxb ? new ObjectId(payload.ma_nxb) : undefined,
      ma_tac_gia: payload.ma_tac_gia
        ? new ObjectId(payload.ma_tac_gia)
        : undefined,
      ma_the_loai: payload.ma_the_loai
        ? new ObjectId(payload.ma_the_loai)
        : undefined,
      mo_ta: payload.mo_ta,
      nam_xuat_ban: payload.nam_xuat_ban,
      anh_bia: payload.anh_bia,
      so_luong: payload.so_luong || 1,
      ngay_tao: payload.ngay_tao || new Date(),
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );

    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      { ten_sach: book.ten_sach, ma_tac_gia: book.ma_tac_gia },
      { $set: book },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByTitle(ten_sach) {
    return await this.find({
      ten_sach: { $regex: new RegExp(ten_sach, "i") },
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;

    const result = await this.Book.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "theloai",
          localField: "ma_the_loai",
          foreignField: "_id",
          as: "theloai",
        },
      },
      {
        $unwind: {
          path: "$theloai",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "tacgia",
          localField: "ma_tac_gia",
          foreignField: "_id",
          as: "tacgia",
        },
      },
      {
        $unwind: {
          path: "$tacgia",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]).toArray();

    return result[0] || null;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const bookId = ObjectId.isValid(id) ? new ObjectId(id) : null;
    if (!bookId) {
      throw new Error("❌ ID không hợp lệ.");
    }

    // Kiểm tra xem sách đã được mượn hay chưa
    const borrowed = await this.Borrow.findOne({ ma_sach: id });
    if (borrowed) {
      throw new Error("❌ Không thể xóa sách vì đã được mượn.");
    }

    // Nếu chưa được mượn, tiến hành xóa
    const result = await this.Book.findOneAndDelete({ _id: bookId });

    if (!result) {
      throw new Error("❌ Không tìm thấy sách để xóa.");
    }

    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }

  async findAll(ma_the_loai) {
    try {
      const matchStage = {};

      if (ma_the_loai) {
        matchStage.ma_the_loai = new ObjectId(ma_the_loai);
      }

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "tacgia",
            localField: "ma_tac_gia",
            foreignField: "_id",
            as: "authorInfo",
          },
        },
        {
          $unwind: {
            path: "$authorInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1, // ID sách
            ten_sach: 1, // Tiêu đề
            anh_bia: 1, // Ảnh bìa
            mo_ta: 1, // Mô tả ✅
            ma_the_loai: 1, // ID thể loại
            ma_tac_gia: 1, // ID tác giả
            ten_tac_gia: "$authorInfo.ho_ten", // Tên tác giả
          },
        },
      ];

      return await this.Book.aggregate(pipeline).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }

  // Lấy danh sách sách kèm tên tác giả, tên nhà xuất bản, thể loại
  async findWithDetails(filter = {}) {
    const pipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "tacgia",
          localField: "ma_tac_gia",
          foreignField: "_id",
          as: "tacgia",
        },
      },
      { $unwind: "$tacgia" },

      {
        $lookup: {
          from: "nhaxuatban",
          localField: "ma_nxb",
          foreignField: "_id",
          as: "nhaxuatban",
        },
      },
      { $unwind: "$nhaxuatban" },

      {
        $lookup: {
          from: "theloai",
          localField: "ma_the_loai",
          foreignField: "_id",
          as: "theloai",
        },
      },
      { $unwind: "$theloai" },

      {
        $project: {
          ten_sach: 1,
          mo_ta: 1,
          nam_xuat_ban: 1,
          anh_bia: 1,
          so_luong: 1,
          ten_tac_gia: "$tacgia.ho_ten",
          ten_nxb: "$nhaxuatban.ten_nxb",
          ten_the_loai: "$theloai.ten_the_loai",
        },
      },
    ];

    return await this.Book.aggregate(pipeline).toArray();
  }
}

module.exports = BookService;
