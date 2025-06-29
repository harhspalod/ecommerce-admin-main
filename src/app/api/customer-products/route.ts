import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeInsert } from '@/lib/database';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const customerProducts = await executeSelect(`
      SELECT cp.*, c.name as customer_name, c.email as customer_email,
             p.name as product_name, p.price as product_price
      FROM customer_products cp
      JOIN customers c ON cp.customer_id = c.id
      JOIN products p ON cp.product_id = p.id
      ORDER BY cp.purchase_date DESC
    `);

    return NextResponse.json({ success: true, data: customerProducts });
  } catch (error) {
    console.error('Customer products GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customer products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, product_id, quantity } = body;

    if (!customer_id || !product_id) {
      return NextResponse.json({ success: false, error: 'Customer ID and Product ID are required' }, { status: 400 });
    }

    const id = nanoid();
    await executeInsert(
      `INSERT INTO customer_products (id, customer_id, product_id, quantity)
       VALUES (?, ?, ?, ?)`,
      [id, customer_id, product_id, quantity || 1]
    );

    const newCustomerProduct = await executeSelect(`
      SELECT cp.*, c.name as customer_name, p.name as product_name
      FROM customer_products cp
      JOIN customers c ON cp.customer_id = c.id
      JOIN products p ON cp.product_id = p.id
      WHERE cp.id = ?
    `, [id]);

    return NextResponse.json({ success: true, data: newCustomerProduct[0] }, { status: 201 });
  } catch (error) {
    console.error('Customer products POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create customer product relationship' }, { status: 500 });
  }
}