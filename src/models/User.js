import mongoose from 'mongoose'
import { schemaOptions } from './modelOptions.js'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  schemaOptions
)

export default mongoose.model('User', UserSchema)
