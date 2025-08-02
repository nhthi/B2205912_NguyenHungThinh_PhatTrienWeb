const { ObjectId } = require("mongodb");

class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection("publishers"); // Tên collection
  }

  extractPublisherData(payload) {
    const publisher = {
      publisherId: payload.publisherId,
      name: payload.name,
      address: payload.address,
    };

    // Xoá các trường undefined
    Object.keys(publisher).forEach(
      (key) => publisher[key] === undefined && delete publisher[key]
    );
    return publisher;
  }

  async create(payload) {
    const publisher = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      { publisherId: publisher.publisherId },
      { $set: publisher },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Publisher.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name, "i") },
    });
  }

  async findById(id) {
    return await this.Publisher.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Publisher.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Publisher.deleteMany({});
    return result.deletedCount;
  }

  async findAll() {
    try {
      return await this.Publisher.find({}).toArray();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw error;
    }
  }
}

module.exports = PublisherService;
