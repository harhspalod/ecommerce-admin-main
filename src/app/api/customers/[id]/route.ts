import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = db.prepare(`
      SELECT c.*, 
             COUNT(cp.id) as total_purchases,
             GROUP_CONCAT(p.name) as purchased_products
      FROM customers c
      LEFT JOIN customer_products cp ON c.id = cp.customer_id
      LEFT JOIN products p ON cp.product_id = p.id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(params.id);
    
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    const stmt = db.prepare(`
      UPDATE customers 
      SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(name, email, phone, address, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    const updatedCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(params.id);
    return NextResponse.json({ success: true, data: updatedCustomer });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = stmt.run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete customer' }, { status: 500 });
  }
}