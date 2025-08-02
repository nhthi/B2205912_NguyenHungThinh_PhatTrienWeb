const { ObjectId } = require("mongodb");

class CategoryService {
  constructor(client) {
    this.Category = client.db().collection("categories"); // Tên collection
  }

  extractCategoryData(payload) {
    const category = {
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description,
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
      { categoryId: category.categoryId },
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
      name: { $regex: new RegExp(name, "i") },
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
