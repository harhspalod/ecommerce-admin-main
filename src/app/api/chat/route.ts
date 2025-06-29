import { NextRequest, NextResponse } from 'next/server';
import { executeSelect, executeInsert } from '@/lib/database';
import { generateAIResponse } from '@/lib/gemini';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const messages = await executeSelect('SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 50');
    return NextResponse.json({ success: true, data: messages.reverse() });
  } catch (error) {
    console.error('Chat GET error:', error);
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
      const products = await executeSelect('SELECT * FROM products WHERE id = ?', [product_id]);
      productContext = products[0] || null;
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, productContext);

    // Save to database
    const id = nanoid();
    await executeInsert(
      `INSERT INTO chat_messages (id, user_message, ai_response)
       VALUES (?, ?, ?)`,
      [id, message, aiResponse]
    );

    const newMessage = await executeSelect('SELECT * FROM chat_messages WHERE id = ?', [id]);
    return NextResponse.json({ success: true, data: newMessage[0] }, { status: 201 });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process chat message' }, { status: 500 });
  }
}