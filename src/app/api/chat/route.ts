import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { generateAIResponse } from '@/lib/gemini';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const messages = db.prepare('SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50').all();
    return NextResponse.json({ success: true, data: messages.reverse() });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch chat messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, product_id } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // Get product context if product_id is provided
    let productContext = null;
    if (product_id) {
      productContext = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, productContext);

    // Save to database
    const id = nanoid();
    const stmt = db.prepare(`
      INSERT INTO chat_messages (id, user_message, ai_response)
      VALUES (?, ?, ?)
    `);

    stmt.run(id, message, aiResponse);

    const newMessage = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(id);
    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process chat message' }, { status: 500 });
  }
}