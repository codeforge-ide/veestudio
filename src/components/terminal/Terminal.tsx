'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export interface TerminalHandle {
  writeLine: (text: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  clear: () => void;
}

interface TerminalProps {
  onReady?: (terminal: TerminalHandle) => void;
}

export default function Terminal({ onReady }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize xterm
    const xterm = new XTerm({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
      theme: {
        background: '#0a0a0a',
        foreground: '#e5e7eb',
        cursor: '#4a90e2',
        black: '#0a0a0a',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#4a90e2',
        magenta: '#8b5cf6',
        cyan: '#06b6d4',
        white: '#e5e7eb',
        brightBlack: '#6b7280',
        brightRed: '#f87171',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#a78bfa',
        brightCyan: '#22d3ee',
        brightWhite: '#f9fafb',
      },
      allowTransparency: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Welcome message
    xterm.writeln('\x1b[36m╔══════════════════════════════════════╗\x1b[0m');
    xterm.writeln('\x1b[36m║   Welcome to VeeStudio Terminal   ║\x1b[0m');
    xterm.writeln('\x1b[36m╚══════════════════════════════════════╝\x1b[0m');
    xterm.writeln('');
    xterm.writeln('\x1b[90mReady for deployment...\x1b[0m');
    xterm.writeln('');

    // Create terminal handle
    const terminalHandle: TerminalHandle = {
      writeLine: (text: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
        const colors = {
          info: '\x1b[34m',    // Blue
          success: '\x1b[32m', // Green
          error: '\x1b[31m',   // Red
          warning: '\x1b[33m', // Yellow
        };
        const reset = '\x1b[0m';
        const timestamp = new Date().toLocaleTimeString();
        xterm.writeln(`${colors[type]}[${timestamp}] ${text}${reset}`);
      },
      clear: () => {
        xterm.clear();
      },
    };

    if (onReady) {
      onReady(terminalHandle);
    }

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, [onReady]);

  return (
    <div className="h-full w-full bg-[#0a0a0a] rounded-lg overflow-hidden">
      <div ref={terminalRef} className="h-full w-full p-2" />
    </div>
  );
}
