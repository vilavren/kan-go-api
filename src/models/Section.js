import mongoose, { Schema } from 'mongoose'
import { schemaOptions } from './modelOptions.js'

const SectionShema = new mongoose.Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  schemaOptions
)

export default mongoose.model('Section', SectionShema)
