import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create a new supplier-product relationship
    const supplierProduct = await prisma.supplierProduct.create({
      data: {
        supplierId: body.supplierId,
        productId: body.productId,
        cost: body.cost,
        leadTime: body.leadTime || null,
      },
    });
    
    return NextResponse.json(supplierProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier-product relationship:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier-product relationship' },
      { status: 500 }
    );
  }
}