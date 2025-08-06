const { ObjectId } = require("mongodb");

class CategoryService {
  constructor(client) {
    this.Category = client.db().collection("theloai"); // Tên collection
  }

  extractCategoryData(payload) {
    const category = {
      ten_the_loai: payload.ten_the_loai,
      mo_ta: payload.mo_ta,
    };

    // Xoá các trường undefined
    Object.keys(category).forEach(
      (key) => category[key] === undefined && delete category[key]
    );
    return category;
  }

  async create(payload) {
    const category = this.extractCategoryData(payload);
    const result = await this.Category.findOneAndUpdate(
      { ten_the_loai: category.ten_the_loai },
      { $set: category },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Category.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      ten_the_loai: { $regex: new RegExp(name, "i") },
    });
  }

  async findById(id) {
    return await this.Category.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractCategoryData(payload);
    const result = await this.Category.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Category.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Category.deleteMany({});
    return result.deletedCount;
  }

  async findAll() {
    try {
      return await this.Category.find({}).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }
}

module.exports = CategoryService;
