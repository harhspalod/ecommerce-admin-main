import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeUpdate, executeDelete } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await executeSelect('SELECT * FROM products WHERE id = ?', [params.id]);
    
    if (product.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product[0] });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, description, price, stock, image_url } = body;

    await executeUpdate(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, description, price, stock, image_url, params.id]
    );

    const updatedProduct = await executeSelect('SELECT * FROM products WHERE id = ?', [params.id]);
    
    if (updatedProduct.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeDelete('DELETE FROM products WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}