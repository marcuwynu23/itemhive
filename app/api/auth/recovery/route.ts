// Password recovery API route
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { z } from 'zod'

const recoverySchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const validatedData = recoverySchema.parse(body)

    // Check if user exists
    const user = await User.findOne({ email: validatedData.email })
    
    // Always return success to prevent email enumeration
    // In production, send actual recovery email
    if (user) {
      // TODO: Send recovery email with reset token
      // For now, we'll just log it
      console.log(`Password recovery requested for: ${validatedData.email}`)
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a recovery link has been sent.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Recovery error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process recovery request' },
      { status: 500 }
    )
  }
}

