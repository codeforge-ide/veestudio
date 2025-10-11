'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { editor } from 'monaco-editor';

export interface TerminalHandle {
  writeLine: (text: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  clear: () => void;
  setProblems: (problems: editor.IMarker[]) => void;
}

interface TerminalProps {
  onReady?: (terminal: TerminalHandle) => void;
}

export default function Terminal({ onReady }: TerminalProps) {
  const outputTerminalRef = useRef<HTMLDivElement>(null);
  const interactiveTerminalRef = useRef<HTMLDivElement>(null);
  const outputXterm = useRef<XTerm | null>(null);
  const interactiveXterm = useRef<XTerm | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [problems, setProblems] = useState<editor.IMarker[]>([]);

  const xtermTheme = {
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
  };

  useEffect(() => {
    const initOutputTerminal = () => {
      if (outputTerminalRef.current && !outputXterm.current) {
        const xterm = new XTerm({
          cursorBlink: false,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          theme: xtermTheme,
          allowTransparency: true,
          scrollback: 1000,
          disableStdin: true,
        });
        const fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);
        xterm.open(outputTerminalRef.current);
        fitAddon.fit();
        outputXterm.current = xterm;

        xterm.writeln('VeeStudio Output...');

        const terminalHandle: TerminalHandle = {
          writeLine: (text, type = 'info') => {
            const colors = { info: '\x1b[34m', success: '\x1b[32m', error: '\x1b[31m', warning: '\x1b[33m' };
            const reset = '\x1b[0m';
            const timestamp = new Date().toLocaleTimeString();
            xterm.writeln(`${colors[type]}[${timestamp}] ${text}${reset}`);
          },
          clear: () => xterm.clear(),
          setProblems: setProblems,
        };
        if (onReady) onReady(terminalHandle);
      }
    };

    const initInteractiveTerminal = () => {
      if (interactiveTerminalRef.current && !interactiveXterm.current) {
        const xterm = new XTerm({
          cursorBlink: true,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          theme: xtermTheme,
          allowTransparency: true,
        });
        const fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);
        xterm.open(interactiveTerminalRef.current);
        fitAddon.fit();
        interactiveXterm.current = xterm;

        xterm.writeln('VeeStudio Terminal');
        xterm.write('$ ');

        let command = '';
        xterm.onData(e => {
          switch (e) {
            case '\r': // Enter
              if (command) {
                xterm.writeln('');
                // Mock command execution
                xterm.writeln(`> ${command}`);
                command = '';
              }
              xterm.write('\r\n$ ');
              break;
            case '\u007F': // Backspace
              if (command.length > 0) {
                xterm.write('\b \b');
                command = command.slice(0, -1);
              }
              break;
            default:
              if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) {
                command += e;
                xterm.write(e);
              }
          }
        });
      }
    };

    if (activeTab === 0) initOutputTerminal();
    if (activeTab === 1) initInteractiveTerminal();

  }, [activeTab, onReady]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Terminal tabs">
          <Tab label="Output" />
          <Tab label="Terminal" />
          <Tab label={`Problems (${problems.length})`} />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box hidden={activeTab !== 0} sx={{ height: '100%' }}>
          <div ref={outputTerminalRef} className="h-full w-full p-2" />
        </Box>
        <Box hidden={activeTab !== 1} sx={{ height: '100%' }}>
          <div ref={interactiveTerminalRef} className="h-full w-full p-2" />
        </Box>
        {activeTab === 2 && (
          <Box p={2} sx={{ overflowY: 'auto', height: '100%' }}>
            <Typography variant="subtitle1">Problems</Typography>
            {problems.length === 0 ? (
              <Typography variant="body2" sx={{ mt: 1 }}>No problems detected.</Typography>
            ) : (
              problems.map((p, i) => (
                <Typography key={i} color={p.severity === 8 ? 'error' : 'warning'} sx={{ mt: 1, fontFamily: 'monospace' }}>
                  [{p.severity === 8 ? 'Error' : 'Warning'}] L{p.startLineNumber}:{p.startColumn} - {p.message}
                </Typography>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
