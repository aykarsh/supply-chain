import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for supplier updates
const supplierUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
})

// GET /api/suppliers/[id] - Get a specific supplier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = params.id
    
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    
    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Failed to fetch supplier:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supplier' },
      { status: 500 }
    )
  }
}

// PUT /api/suppliers/[id] - Update a supplier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = params.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = supplierUpdateSchema.parse(body)
    
    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: validatedData
    })
    
    return NextResponse.json(updatedSupplier)
  } catch (error) {
    console.error('Failed to update supplier:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    // Check if the error is a Prisma error for record not found
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 }
    )
  }
}

// DELETE /api/suppliers/[id] - Delete a supplier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = params.id
    
    await prisma.supplier.delete({
      where: { id: supplierId }
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete supplier:', error)
    
    // Check if the error is a Prisma error for record not found
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    // Check for foreign key constraint violations
    if ((error as any).code === 'P2003') {  
      return NextResponse.json(
        { error: 'Cannot delete supplier because it is referenced by other records' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete supplier' },
      { status: 500 }
    )
  }
}