class MongooseInfra {
  constructor(enteredModel) {
    this.givenModel = enteredModel
  }

  async findByIdAndReturnDocument(enteredId) {
    return await new this.givenModel.findById(enteredId)
  }

  async InsertDocument(enteredDocument) {
    return await new this.givenModel(enteredDocument).save()
  }

  async FindOneAndReturnDocument(enteredObject) {
    return await new this.givenModel.FindOne(enteredObject)
  }
}

module.exports = MongooseInfra
