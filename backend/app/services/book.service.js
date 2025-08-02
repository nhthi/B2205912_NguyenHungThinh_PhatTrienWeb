const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
  }

  extractBookData(payload) {
    const book = {
      title: payload.title,
      publisherId: payload.publisherId
        ? new ObjectId(payload.publisherId)
        : undefined,
      authorId: payload.authorId ? new ObjectId(payload.authorId) : undefined,
      categoryId: payload.categoryId
        ? new ObjectId(payload.categoryId)
        : undefined,
      description: payload.description,
      publishYear: payload.publishYear,
      coverImage: payload.coverImage,
      quantity: payload.quantity || 1,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );

    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      { title: book.title, authorId: book.authorId },
      { $set: book },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByTitle(title) {
    return await this.find({
      title: { $regex: new RegExp(title, "i") },
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
          from: "categories",
          localField: "categoryId",
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
        $lookup: {
          from: "authors",
          localField: "authorId",
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
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }

  async findAll(categoryId) {
    try {
      const matchStage = {};

      if (categoryId) {
        matchStage.categoryId = new ObjectId(categoryId);
      }

      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "authors",
            localField: "authorId",
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
            title: 1, // Tiêu đề
            coverImage: 1, // Ảnh bìa
            description: 1, // Mô tả ✅
            categoryId: 1, // ID thể loại
            authorId: 1, // ID tác giả
            authorName: "$authorInfo.name", // Tên tác giả
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
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      {
        $lookup: {
          from: "publishers",
          localField: "publisherId",
          foreignField: "_id",
          as: "publisher",
        },
      },
      { $unwind: "$publisher" },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $project: {
          title: 1,
          description: 1,
          publishYear: 1,
          coverImage: 1,
          quantity: 1,
          author: "$author.name",
          publisher: "$publisher.name",
          category: "$category.name",
        },
      },
    ];

    return await this.Book.aggregate(pipeline).toArray();
  }
}

module.exports = BookService;
