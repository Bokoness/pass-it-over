import _ from 'lodash'

class BaseModel {
  static createValues

  static updateValues

  /**
     * BaseModel Mongoose parent model
     * @param {Array} createValues list of key values to create instance
     * @param {Array} updateValues list of key values to update instance
     */
  constructor(createValues = [], updateValues = []) {
    BaseModel.updateValues = updateValues
    BaseModel.createValues = createValues
  }

  /**
     * index all records
     * @param {Object} filter the filter
     * @returns {Array<Object>} the array of records
     */
  static async index(filter = {}) {
    return this.find(filter)
  }

  /**
     * show - finds a single record
     * @param {ObjectId} id the record id
     * @returns {Object} mongoose record
     */
  static async show(id) {
    return this.findById(id)
  }

  /**
     * store a single record
     * @param {Object} body the body of the record
     * @returns {ObjectId} the new record id
     */
  static async store(body) {
    const d = this.pick(body, BaseModel.createValues)
    return this.create(d)
  }

  /**
     * update a single record
     * @param {ObjectId} id the record id
     * @param {Object} updates the updates of the record
     * @returns {Object} the updated record
     */
  static async update(id, body) {
    return this.findByIdAndUpdate(
      id,
      {
        $set: this.pick(body, this.updateValues),
      },
      { new: true },
    )
  }

  /**
     * destroy a single record
     * @param {ObjectId} id the record id
     */
  static async destroy(id) {
    return this.findByIdAndDelete(id)
  }

  /**
     * Replicates a single record
     * @param {ObjectId} id the wanted record's id
     * @returns {Object} the replicated record
     */
  static async replicate(id) {
    const parent = await this.findById(id)
    const replicatedData = { ...parent._doc }
    delete replicatedData._id
    return this.create(replicatedData)
  }

  /**
     * Picks modifable values body
     * @param {*} req the request body
     * @returns
     */
  static pick(body, picks) {
    if (body._id) delete body._id // user can't change _id
    if (!picks || !picks.length) return body
    return _.pick(body, picks)
  }

  /**
     * toJson return json representation of the record
     * @returns object version of the record
     */
  toJson() {
    const obj = this.toObject()
    delete obj.password
    return obj
  }
}

export default BaseModel
