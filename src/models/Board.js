import mongoose, { Schema } from 'mongoose'
import { schemaOptions } from './modelOptions.js'

const BoardShema = new mongoose.Schema(
  {
    name: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: {
      type: String,
      default: '📃',
    },
    title: {
      type: String,
      default: 'Без названия',
    },
    description: {
      type: String,
      default: 'Описание',
    },
    position: {
      type: Number,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    favouritePosition: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions
)

export default mongoose.model('Board', BoardShema)
