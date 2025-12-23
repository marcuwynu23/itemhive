// Transaction model - tracks financial transactions
import mongoose, { Schema, Document } from 'mongoose'

export interface ITransaction extends Document {
  type: 'income' | 'expense'
  amount: number
  description?: string
  itemId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)

