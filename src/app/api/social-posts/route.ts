import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeInsert } from '@/lib/database';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const posts = await executeSelect(`
      SELECT sp.*, p.name as product_name
      FROM social_posts sp
      LEFT JOIN products p ON sp.product_id = p.id
      ORDER BY sp.created_at DESC
    `);

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Social posts GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch social posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, platform, product_id, image_url, scheduled_at } = body;

    if (!title || !content || !platform) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, content, and platform are required' 
      }, { status: 400 });
    }

    const id = nanoid();
    await executeInsert(
      `INSERT INTO social_posts (id, title, content, platform, product_id, image_url, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, content, platform, product_id || null, image_url || null, scheduled_at || null]
    );

    const newPost = await executeSelect(`
      SELECT sp.*, p.name as product_name
      FROM social_posts sp
      LEFT JOIN products p ON sp.product_id = p.id
      WHERE sp.id = ?
    `, [id]);

    return NextResponse.json({ success: true, data: newPost[0] }, { status: 201 });
  } catch (error) {
    console.error('Social posts POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create social post' }, { status: 500 });
  }
}