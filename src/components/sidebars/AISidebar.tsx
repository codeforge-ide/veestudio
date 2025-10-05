'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, ChevronLeft } from 'lucide-react';
import { Message } from '@/types';
import { EXAMPLE_PROMPTS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface AISidebarProps {
  onGenerateContract: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export default function AISidebar({ onGenerateContract, isGenerating }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. I can help you generate smart contracts. Try asking me to create a contract, or click one of the examples below!',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      await onGenerateContract(input.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Contract generated successfully! Check your editor.',
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className={`h-full bg-gray-900/50 backdrop-blur-xl border-l border-gray-800 flex flex-col transition-all duration-300 ${isExpanded ? 'w-96' : 'w-16'}`}>
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-semibold text-gray-300">AI Assistant</h2>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <ChevronLeft 
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? '' : 'rotate-180'}`} 
          />
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <p className="text-sm">Generating contract...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Example Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs text-gray-500 font-medium">Try these examples:</p>
              {EXAMPLE_PROMPTS.slice(0, 2).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  className="w-full text-left text-xs text-gray-400 bg-gray-800/50 hover:bg-gray-800 p-2 rounded transition-colors"
                  disabled={isGenerating}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your contract..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!input.trim() || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
