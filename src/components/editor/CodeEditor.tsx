'use client';

import React, { useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { EDITOR_OPTIONS } from '@/lib/constants';
import { Menu, MenuItem } from '@mui/material';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  onAiAction?: (action: 'explain' | 'test' | 'refactor', code: string) => void;
  onMarkersChange?: (markers: editor.IMarker[]) => void;
}

export default function CodeEditor({ value, onChange, language = 'sol', onAiAction, onMarkersChange }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);

  const handleContextMenu = (event: editor.IEditorMouseEvent) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.event.posx,
      mouseY: event.event.posy,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleAiAction = (action: 'explain' | 'test' | 'refactor') => {
    const selectedText = editorRef.current?.getModel()?.getValueInRange(editorRef.current.getSelection()!);
    if (onAiAction && selectedText) {
      onAiAction(action, selectedText);
    }
    handleClose();
  };

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    editor.onContextMenu(handleContextMenu);
    
    monaco.editor.onDidChangeMarkers(([uri]) => {
      const model = monaco.editor.getModels().find(model => model.uri.toString() === uri.toString());
      if (model && onMarkersChange) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        onMarkersChange(markers);
      }
    });

    if (!monaco.languages.getLanguages().some((lang) => lang.id === 'sol')) {
      monaco.languages.register({ id: 'sol' });
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
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleAiAction('explain')}>Explain Code</MenuItem>
        <MenuItem onClick={() => handleAiAction('test')}>Generate Tests</MenuItem>
        <MenuItem onClick={() => handleAiAction('refactor')}>Refactor Code</MenuItem>
      </Menu>
    </div>
  );
}
