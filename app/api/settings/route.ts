// API route for system settings/configuration
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'
import { z } from 'zod'

const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  financialTrackingEnabled: z.boolean().optional(),
})

// GET /api/settings - Get all settings
export async function GET() {
  try {
    await connectDB()
    const settings = await Settings.find().sort({ key: 1 }).lean()

    // Parse JSON values for easier frontend consumption
    const parsedSettings = settings.map((setting: any) => ({
      id: setting._id.toString(),
      key: setting.key,
      value: JSON.parse(setting.value),
      financialTrackingEnabled: setting.financialTrackingEnabled,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    }))

    return NextResponse.json({ success: true, data: parsedSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings - Create or update a setting
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    const updateData: any = {
      value: validatedData.value,
    }

    if (validatedData.financialTrackingEnabled !== undefined) {
      updateData.financialTrackingEnabled = validatedData.financialTrackingEnabled
    }

    const setting = await Settings.findOneAndUpdate(
      { key: validatedData.key },
      {
        key: validatedData.key,
        ...updateData,
      },
      { upsert: true, new: true }
    )

    const transformedSetting = {
      id: setting._id.toString(),
      key: setting.key,
      value: JSON.parse(setting.value),
      financialTrackingEnabled: setting.financialTrackingEnabled,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    }

    return NextResponse.json({ success: true, data: transformedSetting })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
