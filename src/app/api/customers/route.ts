import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeInsert } from '@/lib/database';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const customers = await executeSelect(`
      SELECT c.*, 
             COUNT(cp.id) as total_purchases,
             GROUP_CONCAT(p.name) as purchased_products
      FROM customers c
      LEFT JOIN customer_products cp ON c.id = cp.customer_id
      LEFT JOIN products p ON cp.product_id = p.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Customers GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const id = nanoid();
    await executeInsert(
      `INSERT INTO customers (id, name, email, phone, address)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, email, phone || '', address || '']
    );

    const newCustomer = await executeSelect('SELECT * FROM customers WHERE id = ?', [id]);
    return NextResponse.json({ success: true, data: newCustomer[0] }, { status: 201 });
  } catch (error) {
    console.error('Customers POST error:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create customer' }, { status: 500 });
  }
}