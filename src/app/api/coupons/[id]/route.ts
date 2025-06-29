import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeUpdate, executeDelete } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { code, discount_percentage, valid_until, is_active } = body;

    await executeUpdate(
      `UPDATE coupons 
       SET code = ?, discount_percentage = ?, valid_until = ?, is_active = ?
       WHERE id = ?`,
      [code, discount_percentage, valid_until, is_active, params.id]
    );

    const updatedCoupon = await executeSelect(`
      SELECT c.*, p.name as product_name
      FROM coupons c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = ?
    `, [params.id]);

    if (updatedCoupon.length === 0) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCoupon[0] });
  } catch (error) {
    console.error('Coupon PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeDelete('DELETE FROM coupons WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Coupon DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
  }
}