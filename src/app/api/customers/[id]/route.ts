import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeUpdate, executeDelete } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await executeSelect(`
      SELECT c.*, 
             COUNT(cp.id) as total_purchases,
             GROUP_CONCAT(p.name) as purchased_products
      FROM customers c
      LEFT JOIN customer_products cp ON c.id = cp.customer_id
      LEFT JOIN products p ON cp.product_id = p.id
      WHERE c.id = ?
      GROUP BY c.id
    `, [params.id]);
    
    if (customer.length === 0) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer[0] });
  } catch (error) {
    console.error('Customer GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    await executeUpdate(
      `UPDATE customers 
       SET name = ?, email = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, email, phone, address, params.id]
    );

    const updatedCustomer = await executeSelect('SELECT * FROM customers WHERE id = ?', [params.id]);
    
    if (updatedCustomer.length === 0) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCustomer[0] });
  } catch (error) {
    console.error('Customer PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeDelete('DELETE FROM customers WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Customer DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete customer' }, { status: 500 });
  }
}