import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeInsert, initializeDatabase } from '@/lib/database';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    await initializeDatabase();
    const products = await executeSelect('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const body = await request.json();
    const { name, description, price, stock, image_url } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: 'Name and price are required' }, { status: 400 });
    }

    const id = nanoid();
    await executeInsert(
      `INSERT INTO products (id, name, description, price, stock, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, description || '', price, stock || 0, image_url || 'https://via.placeholder.com/300x200']
    );

    const newProduct = await executeSelect('SELECT * FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true, data: newProduct[0] }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}