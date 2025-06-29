import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeUpdate, executeDelete } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, content, platform, status, scheduled_at } = body;

    await executeUpdate(
      `UPDATE social_posts 
       SET title = ?, content = ?, platform = ?, status = ?, scheduled_at = ?
       WHERE id = ?`,
      [title, content, platform, status, scheduled_at, params.id]
    );

    const updatedPost = await executeSelect(`
      SELECT sp.*, p.name as product_name
      FROM social_posts sp
      LEFT JOIN products p ON sp.product_id = p.id
      WHERE sp.id = ?
    `, [params.id]);

    if (updatedPost.length === 0) {
      return NextResponse.json({ success: false, error: 'Social post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedPost[0] });
  } catch (error) {
    console.error('Social post PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update social post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await executeDelete('DELETE FROM social_posts WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true, message: 'Social post deleted successfully' });
  } catch (error) {
    console.error('Social post DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete social post' }, { status: 500 });
  }
}