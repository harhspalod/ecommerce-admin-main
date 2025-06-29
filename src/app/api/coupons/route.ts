import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const coupons = db.prepare(`
      SELECT c.*, p.name as product_name, p.price as product_price
      FROM coupons c
      JOIN products p ON c.product_id = p.id
      ORDER BY c.created_at DESC
    `).all();

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, product_id, discount_percentage, valid_until } = body;

    if (!code || !product_id || !discount_percentage || !valid_until) {
      return NextResponse.json({ 
        success: false, 
        error: 'Code, product ID, discount percentage, and valid until date are required' 
      }, { status: 400 });
    }

    const id = nanoid();
    const stmt = db.prepare(`
      INSERT INTO coupons (id, code, product_id, discount_percentage, valid_until)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, code, product_id, discount_percentage, valid_until);

    const newCoupon = db.prepare(`
      SELECT c.*, p.name as product_name
      FROM coupons c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = ?
    `).get(id);

    return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
  }
}