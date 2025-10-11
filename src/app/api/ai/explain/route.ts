// src/app/api/ai/explain/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    // In a real implementation, you would call an AI service here.
    // For this example, we'll return a mocked response.
    const explanation = `This piece of Solidity code is explained as follows:\n\n${code}`;
    return NextResponse.json({ success: true, explanation });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to explain code' }, { status: 500 });
  }
}
