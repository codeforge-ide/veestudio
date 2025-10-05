import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const SYSTEM_PROMPT = `You are an expert Solidity smart contract developer for the VeChain blockchain. 
When asked to create a contract, respond ONLY with valid Solidity code. 
Do not include explanations, markdown formatting, or code block markers.
Always include:
- SPDX license identifier
- Pragma statement (use ^0.8.0)
- Clear comments explaining functionality
- Proper events for important state changes
- Security best practices

Generate complete, production-ready contracts that follow Solidity best practices.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'No prompt provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Fallback: Return a template contract if no API key is configured
      console.warn('No AI API key configured, returning template');
      return NextResponse.json({
        success: true,
        code: generateTemplateContract(prompt),
        explanation: 'Generated from template (configure OPENAI_API_KEY for AI generation)',
      });
    }

    // Generate the contract using AI
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: `${SYSTEM_PROMPT}\n\nUser request: ${prompt}`,
      maxTokens: 2000,
    });

    // Clean up the response to ensure it's valid Solidity
    let code = text.trim();
    
    // Remove markdown code blocks if present
    code = code.replace(/```solidity\n?/g, '').replace(/```\n?/g, '');
    
    // Ensure it starts with SPDX or pragma
    if (!code.startsWith('//') && !code.startsWith('pragma')) {
      code = '// SPDX-License-Identifier: MIT\n' + code;
    }

    return NextResponse.json({
      success: true,
      code,
      explanation: 'Contract generated successfully using AI',
    });
  } catch (error) {
    console.error('AI generation error:', error);
    
    // Fallback to template on error
    const { prompt } = await request.json();
    return NextResponse.json({
      success: true,
      code: generateTemplateContract(prompt || ''),
      explanation: 'Generated from template due to AI service error',
    });
  }
}

function generateTemplateContract(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Simple template generation based on keywords
  if (lowerPrompt.includes('counter')) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Counter
 * @dev Simple counter contract with increment and decrement
 */
contract Counter {
    uint256 private count;
    
    event CountChanged(uint256 newCount, address changer);
    
    constructor() {
        count = 0;
    }
    
    function increment() public {
        count += 1;
        emit CountChanged(count, msg.sender);
    }
    
    function decrement() public {
        require(count > 0, "Counter: cannot decrement below zero");
        count -= 1;
        emit CountChanged(count, msg.sender);
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
    
    function reset() public {
        count = 0;
        emit CountChanged(count, msg.sender);
    }
}`;
  }
  
  if (lowerPrompt.includes('token')) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleToken
 * @dev Basic token implementation
 */
contract SimpleToken {
    string public name = "VeeToken";
    string public symbol = "VEE";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
}`;
  }
  
  // Default template
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ${extractContractName(prompt)}
 * @dev Contract generated based on: ${prompt}
 */
contract ${extractContractName(prompt)} {
    address public owner;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    // Add your contract logic here
}`;
}

function extractContractName(prompt: string): string {
  const words = prompt.split(' ');
  for (const word of words) {
    if (word.length > 3 && /^[A-Za-z]+$/.test(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }
  return 'MyContract';
}
