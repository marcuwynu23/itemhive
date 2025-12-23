// User model for authentication (optional multi-user support)
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name?: string
  password: string
  role: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: true, // In production, this should be hashed
    },
    role: {
      type: String,
      default: 'user', // "admin" or "user"
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

