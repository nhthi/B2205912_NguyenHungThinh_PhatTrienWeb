const { ObjectId } = require("mongodb");

class AuthorService {
  constructor(client) {
    this.Author = client.db().collection("authors"); // Tên collection
  }

  extractAuthorData(payload) {
    const author = {
      authorId: payload.authorId,
      name: payload.name,
      biography: payload.biography,
      nationality: payload.nationality,
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
      { authorId: author.authorId },
      { $set: author },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Author.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name, "i") },
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
