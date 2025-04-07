import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check if default user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        message: 'Default user already exists',
        user: existingUser,
        seeded: false 
      });
    }
    
    // Create default admin user
    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      }
    });
    
    return NextResponse.json({ 
      message: 'Successfully created default user',
      user,
      seeded: true 
    });
  } catch (error) {
    console.error('Error creating default user:', error);
    return NextResponse.json(
      { error: 'Failed to create default user' },
      { status: 500 }
    );
  }
}