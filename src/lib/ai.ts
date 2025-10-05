// AI integration utilities
import { DEMO_CONTRACTS } from './constants';

function selectDemoContract(prompt: string): { code: string; explanation: string } | null {
  const lowerPrompt = prompt.toLowerCase();
  
  // Match keywords to demo contracts
  if (lowerPrompt.includes('counter') || lowerPrompt.includes('increment') || lowerPrompt.includes('decrement')) {
    return {
      code: DEMO_CONTRACTS.counter,
      explanation: 'Generated a Counter contract with increment, decrement, and reset functions.',
    };
  }
  
  if (lowerPrompt.includes('token') || lowerPrompt.includes('erc20') || lowerPrompt.includes('erc-20')) {
    return {
      code: DEMO_CONTRACTS.token,
      explanation: 'Generated a Simple Token contract with basic ERC20 functionality including transfer, approve, and transferFrom.',
    };
  }
  
  if (lowerPrompt.includes('voting') || lowerPrompt.includes('vote') || lowerPrompt.includes('proposal')) {
    return {
      code: DEMO_CONTRACTS.voting,
      explanation: 'Generated a Voting contract where users can create proposals and vote on them.',
    };
  }
  
  if (lowerPrompt.includes('nft') || lowerPrompt.includes('non-fungible') || lowerPrompt.includes('erc721')) {
    return {
      code: DEMO_CONTRACTS.nft,
      explanation: 'Generated a Simple NFT contract for minting and transferring unique tokens.',
    };
  }
  
  if (lowerPrompt.includes('storage') || lowerPrompt.includes('store') || lowerPrompt.includes('save')) {
    return {
      code: DEMO_CONTRACTS.storage,
      explanation: 'Generated a Simple Storage contract for storing and retrieving user data.',
    };
  }
  
  // Default fallback - return counter as it's the simplest
  return {
    code: DEMO_CONTRACTS.counter,
    explanation: 'Generated a Counter contract as a starting point. Modify the prompt for specific contract types like "token", "voting", "NFT", or "storage".',
  };
}

export async function generateContract(prompt: string): Promise<{ code: string; explanation: string }> {
  try {
    // Try AI generation first
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.success && data.code) {
      return {
        code: data.code,
        explanation: data.explanation || 'Contract generated successfully',
      };
    }
    
    // If AI fails, fall back to demo contracts
    console.log('AI generation failed, using demo contract fallback');
    const demoResult = selectDemoContract(prompt);
    return demoResult!;
  } catch (error) {
    console.error('AI generation error, falling back to demo contracts:', error);
    // Always return a demo contract as fallback - never throw error
    const demoResult = selectDemoContract(prompt);
    return demoResult!;
  }
}

export function extractContractName(code: string): string {
  const match = code.match(/contract\s+(\w+)/);
  return match ? match[1] : 'Contract';
}
