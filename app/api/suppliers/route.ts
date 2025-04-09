import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST: Add Supplier
export async function POST(req: Request) {
  const body = await req.json()
  const { name, items, quantity } = body

  if (!name || !items || !quantity) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      items,
      quantity: parseInt(quantity),
    },
  })

  return NextResponse.json(supplier)
}

// DELETE: Delete Supplier
export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing supplier ID' }, { status: 400 })
  }

  await prisma.supplier.delete({
    where: {
      id,
    },
  })

  return NextResponse.json({ message: 'Deleted successfully' })
}
