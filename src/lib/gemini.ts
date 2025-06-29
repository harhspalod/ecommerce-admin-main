import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

export async function generateAIResponse(userMessage: string, productContext?: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let prompt = `You are an AI assistant for an ecommerce admin panel. Help with product-related questions, business insights, and general ecommerce advice.

User question: ${userMessage}`;

    if (productContext) {
      prompt += `\n\nProduct context: ${JSON.stringify(productContext)}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}