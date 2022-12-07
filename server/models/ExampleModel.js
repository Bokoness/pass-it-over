import mongoose from 'mongoose'
import exampleSchema from './schemas/exampleSchema.js'
import BaseModel from './BaseModel.js'

class ExampleClass extends BaseModel {
  constructor() {
    super([], [])
  }
}

exampleSchema.loadClass(ExampleClass)

export default mongoose.model('example', exampleSchema)
