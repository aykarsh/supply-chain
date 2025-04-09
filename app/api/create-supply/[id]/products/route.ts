import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for supplier product relationship
const supplierProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  cost: z.number().positive('Cost must be positive'),
  leadTime: z.number().int().optional().nullable(),
})

// GET /api/suppliers/[id]/products - Get products for a supplier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = params.id
    
    const supplierProducts = await prisma.supplierProduct.findMany({
      where: { supplierId },
      include: {
        product: true
      }
    })
    
    return NextResponse.json(supplierProducts)
  } catch (error) {
    console.error('Failed to fetch supplier products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supplier products' },
      { status: 500 }
    )
  }
}

// POST /api/suppliers/[id]/products - Add a product to a supplier
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = params.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = supplierProductSchema.parse(body)
    
    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    })
    
    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Check if relationship already exists
    const existingRelation = await prisma.supplierProduct.findUnique({
      where: {
        supplierId_productId: {
          supplierId,
          productId: validatedData.productId
        }
      }
    })
    
    if (existingRelation) {
      return NextResponse.json(
        { error: 'This product is already associated with this supplier' },
        { status: 400 }
      )
    }
    
    // Create the relationship
    const supplierProduct = await prisma.supplierProduct.create({
      data: {
        supplierId,
        productId: validatedData.productId,
        cost: validatedData.cost,
        leadTime: validatedData.leadTime || null,
      },
      include: {
        product: true
      }
    })
    
    return NextResponse.json(supplierProduct, { status: 201 })
  } catch (error) {
    console.error('Failed to add product to supplier:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add product to supplier' },
      { status: 500 }
    )
  }
}   