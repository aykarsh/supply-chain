import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Initial categories to seed the database
const initialCategories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Accessories', description: 'Various accessories for products' },
  { name: 'Home Office', description: 'Products for home and office use' },
  { name: 'Clothing', description: 'Apparel and wearable items' },
  { name: 'Food & Beverages', description: 'Consumable products' },
];

export async function GET() {
  try {
    // Check if categories already exist
    const existingCount = await prisma.category.count();
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: `Database already has ${existingCount} categories.`,
        seeded: false 
      });
    }
    
    // Create categories
    const categories = await Promise.all(
      initialCategories.map(category => 
        prisma.category.create({
          data: category
        })
      )
    );
    
    return NextResponse.json({ 
      message: `Successfully seeded ${categories.length} categories.`,
      categories,
      seeded: true 
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { error: 'Failed to seed categories' },
      { status: 500 }
    );
  }
}