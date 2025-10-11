// AI integration utilities
import { DEMO_CONTRACTS } from './constants';

async function performAiAction(endpoint: string, body: object): Promise<any> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`AI action failed: ${response.statusText}`);
  }
  return response.json();
}

export async function explainCode(code: string): Promise<string> {
  const data = await performAiAction('/api/ai/explain', { code });
  return data.explanation;
}

export async function generateTests(code: string): Promise<string> {
  const data = await performAiAction('/api/ai/test', { code });
  return data.tests;
}

export async function refactorCode(code: string): Promise<string> {
  const data = await performAiAction('/api/ai/refactor', { code });
  return data.refactoredCode;
}

function selectDemoContract(prompt: string): { code: string; explanation: string } | null {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('counter')) return { code: DEMO_CONTRACTS.counter, explanation: 'Generated a Counter contract.' };
  if (lowerPrompt.includes('token')) return { code: DEMO_CONTRACTS.token, explanation: 'Generated a Simple Token contract.' };
  if (lowerPrompt.includes('voting')) return { code: DEMO_CONTRACTS.voting, explanation: 'Generated a Voting contract.' };
  if (lowerPrompt.includes('nft')) return { code: DEMO_CONTRACTS.nft, explanation: 'Generated a Simple NFT contract.' };
  if (lowerPrompt.includes('storage')) return { code: DEMO_CONTRACTS.storage, explanation: 'Generated a Simple Storage contract.' };
  
  return { code: DEMO_CONTRACTS.counter, explanation: 'Generated a Counter contract as a default.' };
}

export async function generateContract(prompt: string): Promise<{ code: string; explanation: string }> {
  try {
    const data = await performAiAction('/api/ai/generate', { prompt });
    if (data.success && data.code) {
      return {
        code: data.code,
        explanation: data.explanation || 'Contract generated successfully',
      };
    }
    return selectDemoContract(prompt)!;
  } catch (error) {
    console.error('AI generation error, falling back to demo contracts:', error);
    return selectDemoContract(prompt)!;
  }
}

export function extractContractName(code: string): string {
  const match = code.match(/contract\s+(\w+)/);
  return match ? match[1] : 'Contract';
}
