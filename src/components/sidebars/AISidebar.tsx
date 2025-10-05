'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Fade,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { Message } from '@/types';
import { EXAMPLE_PROMPTS } from '@/lib/constants';

interface AISidebarProps {
  onGenerateContract: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export default function AISidebar({ onGenerateContract, isGenerating }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant for VeChain smart contract development. I can help you generate Solidity contracts from natural language descriptions. What would you like to build?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
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
        content: '✨ Contract generated successfully! Check your editor to see the code. You can now compile and deploy it.',
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Box 
      sx={{ 
        width: 400,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          height: 64,
          flexShrink: 0,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          gap: 1.5,
          backgroundColor: 'rgba(75, 144, 226, 0.05)',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SmartToyIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            AI Assistant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Powered by GPT-4
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          px: 3,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        }}
      >
        {messages.map((message) => (
          <Fade in key={message.id} timeout={300}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {/* Avatar */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: message.role === 'user' ? 2 : '50%',
                  backgroundColor: message.role === 'user' 
                    ? 'primary.main' 
                    : 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {message.role === 'user' ? (
                  <PersonIcon sx={{ fontSize: 18, color: 'white' }} />
                ) : (
                  <SmartToyIcon sx={{ fontSize: 18, color: 'white' }} />
                )}
              </Box>

              {/* Message Content */}
              <Box sx={{ flex: 1, maxWidth: '85%' }}>
                <Typography 
                  variant="caption" 
                  fontWeight={600}
                  sx={{ 
                    mb: 0.5,
                    display: 'block',
                    color: message.role === 'user' ? 'primary.main' : 'secondary.main',
                  }}
                >
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: message.role === 'user' 
                      ? 'rgba(74, 144, 226, 0.1)' 
                      : 'action.hover',
                    border: 1,
                    borderColor: message.role === 'user'
                      ? 'rgba(74, 144, 226, 0.3)'
                      : 'divider',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.7,
                      color: 'text.primary',
                    }}
                  >
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Fade>
        ))}
        
        {isGenerating && (
          <Fade in timeout={300}>
            <Box display="flex" gap={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SmartToyIcon sx={{ fontSize: 18, color: 'white' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" fontWeight={600} color="secondary.main" sx={{ mb: 0.5, display: 'block' }}>
                  AI Assistant
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: 'action.hover',
                    border: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <CircularProgress size={16} color="secondary" />
                  <Typography variant="body2" color="text.secondary">
                    Generating your smart contract...
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Fade>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Example Prompts Section */}
      {messages.length <= 1 && (
        <>
          <Divider />
          <Box sx={{ px: 3, py: 2, backgroundColor: 'rgba(139, 92, 246, 0.05)' }}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <LightbulbOutlinedIcon sx={{ fontSize: 18, color: 'warning.main' }} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Try these examples:
              </Typography>
            </Box>
            <Stack spacing={1}>
              {EXAMPLE_PROMPTS.slice(0, 3).map((prompt, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleExampleClick(prompt)}
                  disabled={isGenerating}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    py: 1.5,
                    px: 2,
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(74, 144, 226, 0.05)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {prompt}
                  </Typography>
                </Button>
              ))}
            </Stack>
          </Box>
        </>
      )}

      {/* Input Area */}
      <Divider />
      <Box 
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the smart contract you want to create..."
            disabled={isGenerating}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'action.hover',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.paper',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={!input.trim() || isGenerating}
            fullWidth
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3A7AC2 0%, #7B4CE6 100%)',
              },
              py: 1.5,
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Contract'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
