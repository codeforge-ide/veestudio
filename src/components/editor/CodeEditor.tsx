'use client';

import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { EDITOR_OPTIONS } from '@/lib/constants';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export default function CodeEditor({ value, onChange, language = 'sol' }: CodeEditorProps) {
  const editorRef = useRef<unknown>(null);

  function handleEditorDidMount(editor: unknown, monaco: unknown) {
    editorRef.current = editor;
    
    // Register Solidity language if not already registered
    const monacoTyped = monaco as { languages: { getLanguages: () => { id: string }[]; register: (config: { id: string }) => void; setMonarchTokensProvider: (id: string, provider: unknown) => void } };
    if (!monacoTyped.languages.getLanguages().some((lang: { id: string }) => lang.id === 'sol')) {
      monacoTyped.languages.register({ id: 'sol' });
      
      // Basic Solidity syntax highlighting
      monacoTyped.languages.setMonarchTokensProvider('sol', {
        tokenizer: {
          root: [
            [/pragma\s+solidity/, 'keyword'],
            [/contract|interface|library|function|modifier|event|struct|enum|mapping|address|uint|int|bool|string|bytes/, 'keyword'],
            [/public|private|internal|external|pure|view|payable|constant/, 'keyword'],
            [/if|else|while|for|do|return|break|continue|throw|emit|require|assert|revert/, 'keyword'],
            [/[0-9]+/, 'number'],
            [/".*?"/, 'string'],
            [/\/\/.*$/, 'comment'],
            [/\/\*/, 'comment', '@comment'],
          ],
          comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment'],
          ],
        },
      });
    }
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={EDITOR_OPTIONS}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
