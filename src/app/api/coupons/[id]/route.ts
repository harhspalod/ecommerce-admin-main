import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { code, discount_percentage, valid_until, is_active } = body;

    const stmt = db.prepare(`
      UPDATE coupons 
      SET code = ?, discount_percentage = ?, valid_until = ?, is_active = ?
      WHERE id = ?
    `);

    const result = stmt.run(code, discount_percentage, valid_until, is_active, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    const updatedCoupon = db.prepare(`
      SELECT c.*, p.name as product_name
      FROM coupons c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updatedCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare('DELETE FROM coupons WHERE id = ?');
    const result = stmt.run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}