'use client';

import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { EDITOR_OPTIONS } from '@/lib/constants';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export default function CodeEditor({ value, onChange, language = 'sol' }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    
    // Register Solidity language if not already registered
    if (!monaco.languages.getLanguages().some((lang: any) => lang.id === 'sol')) {
      monaco.languages.register({ id: 'sol' });
      
      // Basic Solidity syntax highlighting
      monaco.languages.setMonarchTokensProvider('sol', {
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
