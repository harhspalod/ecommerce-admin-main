import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, content, platform, status, scheduled_at } = body;

    const stmt = db.prepare(`
      UPDATE social_posts 
      SET title = ?, content = ?, platform = ?, status = ?, scheduled_at = ?
      WHERE id = ?
    `);

    const result = stmt.run(title, content, platform, status, scheduled_at, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Social post not found' }, { status: 404 });
    }

    const updatedPost = db.prepare(`
      SELECT sp.*, p.name as product_name
      FROM social_posts sp
      LEFT JOIN products p ON sp.product_id = p.id
      WHERE sp.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update social post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare('DELETE FROM social_posts WHERE id = ?');
    const result = stmt.run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ success: false, error: 'Social post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Social post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete social post' }, { status: 500 });
  }
}