// Item model - main inventory items
import mongoose, { Schema, Document } from 'mongoose'

export interface IItem extends Document {
  name: string
  categoryId: mongoose.Types.ObjectId
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Note: Cascade delete is handled in the API route when deleting categories

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema)

