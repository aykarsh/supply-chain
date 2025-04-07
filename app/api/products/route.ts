import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    // Build filter conditions
    const where = {
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
      ...(category ? { categoryId: category } : {}),
    };
    
    // Fetch products with pagination and filtering
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        inventory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Get total count for pagination
    const total = await prisma.product.count({ where });
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if the user exists
    let userId = body.userId || 'default-user';
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    // If user doesn't exist, try to get the default admin user or create one
    if (!userExists) {
      // Try to find the admin user
      const adminUser = await prisma.user.findFirst({
        where: { email: 'admin@example.com' }
      });
      
      if (adminUser) {
        userId = adminUser.id;
      } else {
        // Create a default admin user if none exists
        const newUser = await prisma.user.create({
          data: {
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN',
          }
        });
        userId = newUser.id;
      }
    }
    
    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: body.categoryId },
    });
    
    // If category doesn't exist and we have a name, create a default category
    if (!categoryExists) {
      if (body.categoryId === 'electronics' || 
          body.categoryId === 'accessories' || 
          body.categoryId === 'home-office' || 
          body.categoryId === 'clothing') {
        
        // Create the category with the same ID as provided
        const categoryName = {
          'electronics': 'Electronics',
          'accessories': 'Accessories',
          'home-office': 'Home Office',
          'clothing': 'Clothing'
        }[body.categoryId];
        
        await prisma.category.create({
          data: {
            id: body.categoryId,
            name: categoryName,
            description: `${categoryName} category`
          }
        });
      } else {
        return NextResponse.json(
          { error: 'Category not found. Please select a valid category.' },
          { status: 400 }
        );
      }
    }
    
    // Create a new product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        sku: body.sku,
        price: body.price,
        cost: body.cost,
        categoryId: body.categoryId,
        createdById: userId, // Use the verified or newly created user ID
        
        // Create inventory record at the same time
        inventory: {
          create: {
            quantity: body.initialQuantity || 0,
            minQuantity: body.minQuantity || 10,
            maxQuantity: body.maxQuantity,
            location: body.location,
          }
        }
      },
      include: {
        category: true,
        inventory: true,
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}