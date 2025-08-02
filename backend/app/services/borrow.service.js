const { ObjectId } = require("mongodb");

class BorrowService {
  constructor(client) {
    this.Borrow = client.db().collection("borrows");
    this.Book = client.db().collection("books");
  }

  extractBorrowData(payload) {
    const borrow = {
      userId: payload.userId,
      bookId: payload.bookId,
      borrowDate: payload.borrowDate || new Date(),
      dueDate: payload.dueDate, // hạn trả
      returnDate: payload.returnDate || null, // ngày trả thực tế
      fine: payload.fine || 0, // tiền phạt (nếu có)
      status: payload.status || "pending",
      quantity: payload.quantity || 1, // hoặc "returned"
    };

    Object.keys(borrow).forEach(
      (key) => borrow[key] === undefined && delete borrow[key]
    );
    return borrow;
  }

  async create(payload) {
    const borrow = this.extractBorrowData(payload);

    // Bước 1: Lấy thông tin sách từ collection
    const book = await this.Book.findOne({ _id: new ObjectId(borrow.bookId) });

    if (!book) {
      throw new Error("Không tìm thấy sách");
    }

    // Bước 2: Kiểm tra quantity yêu cầu
    const requestedQuantity = borrow.quantity || 1; // Giả sử người mượn nhập vào trường quantity

    if (book.quantity < requestedQuantity) {
      throw new Error(
        `Sách chỉ còn ${book.quantity} bản, không đủ số lượng yêu cầu (${requestedQuantity})`
      );
    }

    // Bước 3: Tạo phiếu mượn
    const result = await this.Borrow.insertOne(borrow);

    // Bước 4: Trừ số lượng sách
    await this.Book.updateOne(
      { _id: book._id },
      { $inc: { quantity: -requestedQuantity } }
    );

    return result;
  }

  async find(filter) {
    console.log(filter);

    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          bookObjectId: { $toObjectId: "$bookId" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookObjectId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" }, // nếu chỉ lấy 1
      {
        $project: {
          _id: 1,
          userId: 1,
          bookId: 1,
          quantity: 1,
          borrowDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,
          fine: 1,
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
          userId: { $toObjectId: "$userId" },
          bookId: { $toObjectId: "$bookId" },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },

      {
        $project: {
          _id: 1,
          borrowDate: 1,
          dueDate: 1,
          returnDate: 1,
          fine: 1,
          status: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "book._id": 1,
          "book.title": 1,
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
  async returnBook(id, returnDate = new Date()) {
    const borrow = await this.findById(id);
    if (!borrow) return null;

    const due = new Date(borrow.dueDate);
    const returned = new Date(returnDate);

    let fine = 0;
    if (returned > due) {
      const lateDays = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
      fine = lateDays * 1000; // 1000 VNĐ / ngày trễ
    }

    const result = await this.Borrow.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          returnDate: returned,
          fine: fine,
          status: "returned",
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
