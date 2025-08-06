const { ObjectId } = require("mongodb");

class BorrowService {
  constructor(client) {
    this.Borrow = client.db().collection("theodoimuonsach");
    this.Book = client.db().collection("sach");
  }

  extractBorrowData(payload) {
    const borrow = {
      ma_doc_gia: payload.ma_doc_gia,
      ma_sach: payload.ma_sach,
      ngay_muon: payload.ngay_muon || new Date(),
      han_tra: payload.han_tra, // hạn trả
      ngay_tra_thuc_te: payload.ngay_tra_thuc_te || null, // ngày trả thực tế
      tien_phat: payload.tien_phat || 0, // tiền phạt (nếu có)
      trang_thai: payload.trang_thai || "pending",
      so_luong: payload.so_luong || 1, // hoặc "returned"
    };

    Object.keys(borrow).forEach(
      (key) => borrow[key] === undefined && delete borrow[key]
    );
    return borrow;
  }

  async create(payload) {
    const borrow = this.extractBorrowData(payload);

    // Bước 1: Lấy thông tin sách từ collection
    const book = await this.Book.findOne({ _id: new ObjectId(borrow.ma_sach) });

    if (!book) {
      throw new Error("Không tìm thấy sách");
    }

    // Bước 2: Kiểm tra quantity yêu cầu
    const requestedQuantity = borrow.so_luong || 1; // Giả sử người mượn nhập vào trường so_luong

    if (book.so_luong < requestedQuantity) {
      throw new Error(
        `Sách chỉ còn ${book.so_luong} bản, không đủ số lượng yêu cầu (${requestedQuantity})`
      );
    }

    // Bước 3: Tạo phiếu mượn
    const result = await this.Borrow.insertOne(borrow);

    // Bước 4: Trừ số lượng sách
    await this.Book.updateOne(
      { _id: book._id },
      { $inc: { so_luong: -requestedQuantity } }
    );

    return result;
  }

  async find(filter) {
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          bookObjectId: { $toObjectId: "$ma_sach" },
        },
      },
      {
        $lookup: {
          from: "sach",
          localField: "bookObjectId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" }, // nếu chỉ lấy 1
      {
        $project: {
          _id: 1,
          ma_doc_gia: 1,
          ma_sach: 1,
          so_luong: 1,
          ngay_muon: 1,
          han_tra: 1,
          ngay_tra_thuc_te: 1,
          trang_thai: 1,
          tien_phat: 1,
          book: 1, // dữ liệu từ books
        },
      },
    ];

    const cursor = await this.Borrow.aggregate(pipeline);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Borrow.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findWithDetails(filter = {}) {
    const pipeline = [
      { $match: filter },

      // Convert string ID to ObjectId
      {
        $addFields: {
          userId: { $toObjectId: "$ma_doc_gia" },
          bookId: { $toObjectId: "$ma_sach" },
        },
      },

      {
        $lookup: {
          from: "nguoidung",
          localField: "userId",
          foreignField: "_id",
          as: "docgia",
        },
      },
      { $unwind: "$docgia" },

      {
        $lookup: {
          from: "sach",
          localField: "bookId",
          foreignField: "_id",
          as: "sach",
        },
      },
      { $unwind: "$sach" },

      {
        $project: {
          _id: 1,
          ngay_muon: 1,
          han_tra: 1,
          ngay_tra_thuc_te: 1,
          tien_phat: 1,
          trang_thai: 1,
          "docgia._id": 1,
          "docgia.ho_ten": 1,
          "docgia.email": 1,
          "sach._id": 1,
          "sach.ten_sach": 1,
        },
      },
    ];

    try {
      return await this.Borrow.aggregate(pipeline).toArray();
    } catch (error) {
      console.error("Error in findWithDetails:", error);
      throw error;
    }
  }

  // Hàm cập nhật trả sách và tính tiền phạt nếu có
  async returnBook(id, ngay_tra_thuc_te = new Date()) {
    const borrow = await this.findById(id);
    if (!borrow) return null;

    const due = new Date(borrow.han_tra);
    const returned = new Date(ngay_tra_thuc_te);

    let fine = 0;
    if (returned > due) {
      const lateDays = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
      fine = lateDays * 1000; // 1000 VNĐ / ngày trễ
    }

    const result = await this.Borrow.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ngay_tra_thuc_te: returned,
          tien_phat: fine,
          trang_thai: "returned",
        },
      },
      { returnDocument: "after" }
    );

    return result;
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const result = await this.Borrow.findOneAndUpdate(
      filter,
      { $set: payload },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Borrow.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Borrow.deleteMany({});
    return result.deletedCount;
  }

  async findAll() {
    try {
      return await this.Borrow.find({}).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }
}

module.exports = BorrowService;
