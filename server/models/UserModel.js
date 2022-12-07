import mongoose from 'mongoose'
import passwordHash from 'password-hash'
import userSchema from './schemas/userSchema.js'
import BaseModel from './BaseModel.js'

class UserClass extends BaseModel {
  constructor() {
    super([], [])
  }

  /**
     * findByCredentials - find user by email and validate its password
     * @param {String} email the user's email
     * @param {String} password the user's password
     * @returns false if no user or password isn't valid, return the user instance otherwise
     */
  static async findByCredentials(email, password) {
    const user = await this.findOne({ email })
    if (!user || !(await user.checkPass(password))) return false
    return user
  }

  /**
     * checkPass verify password with hashed password saved in user's instance
     * @param {String} pass the password to compare
     * @returns {Boolean} true or false if passwords are matched
     */
  checkPass(pass) {
    return passwordHash.verify(pass, this.password)
  }

  toJson() {
    const obj = this.toObject()
    delete obj.password
    return obj
  }
}

userSchema.loadClass(UserClass)

const User = mongoose.model('User', userSchema)

export default User
