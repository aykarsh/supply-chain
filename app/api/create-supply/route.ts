import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for supplier creation and validation
const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
})

// GET /api/suppliers - Get all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Failed to fetch suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

// POST /api/suppliers - Create a new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = supplierSchema.parse(body)
    
    // Using a placeholder user ID (in production, get from auth)
    const createdById = "user_placeholder_id"
    
    const supplier = await prisma.supplier.create({
      data: {
        ...validatedData,
        createdById
      }
    })
    
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error('Failed to create supplier:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}