// Settings model - system configuration
import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
  key: string
  value: string // Stored as JSON string
  financialTrackingEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
    financialTrackingEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Settings ||
  mongoose.model<ISettings>('Settings', SettingsSchema)

