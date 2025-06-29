import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(params.id);
    
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, description, price, stock, image_url } = body;

    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(name, description, price, stock, image_url, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(params.id);
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}