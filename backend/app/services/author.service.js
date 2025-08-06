const { ObjectId } = require("mongodb");

class AuthorService {
  constructor(client) {
    this.Author = client.db().collection("tacgia"); // Tên collection
  }

  extractAuthorData(payload) {
    const author = {
      ho_ten: payload.ho_ten,
      tieu_su: payload.tieu_su,
      quoc_tich: payload.quoc_tich,
    };

    // Xoá các trường undefined
    Object.keys(author).forEach(
      (key) => author[key] === undefined && delete author[key]
    );
    return author;
  }

  async create(payload) {
    const author = this.extractAuthorData(payload);
    const result = await this.Author.findOneAndUpdate(
      { ho_ten: author.ho_ten }, // Tìm theo tên tác giả
      { $set: author }, // Cập nhật các trường author
      { upsert: true, returnDocument: "after" } // Tạo mới nếu chưa có
    );
    return result; // lấy `value`, không lấy nguyên `result`
  }

  async find(filter) {
    const cursor = await this.Author.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      ho_ten: { $regex: new RegExp(name, "i") },
    });
  }

  async findById(id) {
    return await this.Author.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractAuthorData(payload);
    const result = await this.Author.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Author.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Author.deleteMany({});
    return result.deletedCount;
  }

  async findAll() {
    try {
      return await this.Author.find({}).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }
}

module.exports = AuthorService;
