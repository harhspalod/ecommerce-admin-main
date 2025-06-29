import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/database';
import { nanoid } from 'nanoid';

// Initialize database on first load
initializeDatabase();

export async function GET() {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, stock, image_url } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: 'Name and price are required' }, { status: 400 });
    }

    const id = nanoid();
    const stmt = db.prepare(`
      INSERT INTO products (id, name, description, price, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, description || '', price, stock || 0, image_url || '');

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}