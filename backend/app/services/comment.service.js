const { ObjectId } = require("mongodb");

class CommentService {
  constructor(client) {
    this.Comment = client.db().collection("comments"); // Tên collection là 'comments'
  }

  extractCommentData(payload) {
    const comment = {
      userId: payload.userId,
      bookId: payload.bookId,
      content: payload.content,
      rating: payload.rating || 5,
      createdAt: payload.createdAt || new Date(),
    };

    // Xóa các trường undefined
    Object.keys(comment).forEach(
      (key) => comment[key] === undefined && delete comment[key]
    );

    return comment;
  }

  async create(payload) {
    const comment = this.extractCommentData(payload);
    const result = await this.Comment.insertOne(comment);
    return result.ops ? result.ops[0] : comment;
  }

  async find(filter) {
    const cursor = await this.Comment.find(filter);
    return await cursor.toArray();
  }

  async findByBookId(bookId) {
    const comments = await this.Comment.aggregate([
      {
        $match: {
          bookId: bookId, // vì là string nên giữ nguyên
        },
      },
      {
        $addFields: {
          userId: { $toObjectId: "$userId" },
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
      {
        $unwind: "$user",
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          rating: 1,
          "user.name": 1,
          "user._id": 1,
        },
      },
    ]).toArray();

    return comments;
  }

  async findByUserId(userId) {
    const comments = await this.Comment.aggregate([
      {
        $match: { userId }, // userId là string, không cần chuyển đổi
      },
      {
        $addFields: {
          bookId: { $toObjectId: "$bookId" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          rating: 1,
          bookTitle: "$book.title",
        },
      },
    ]).toArray();

    return comments;
  }

  async findById(id) {
    return await this.Comment.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractCommentData(payload);
    const result = await this.Comment.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    return await this.Comment.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async deleteAll() {
    const result = await this.Comment.deleteMany({});
    return result.deletedCount;
  }

  async findAll() {
    try {
      return await this.Comment.find({}).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }
}

module.exports = CommentService;
