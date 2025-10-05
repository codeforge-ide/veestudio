// AI integration utilities

export async function generateContract(prompt: string): Promise<{ code: string; explanation: string }> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate contract');
    }

    return {
      code: data.code,
      explanation: data.explanation || 'Contract generated successfully',
    };
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export function extractContractName(code: string): string {
  const match = code.match(/contract\s+(\w+)/);
  return match ? match[1] : 'Contract';
}
