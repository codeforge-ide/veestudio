'use client';

import React, { useState } from 'react';
import { FileCode2, Play, Rocket, ChevronRight } from 'lucide-react';
import { SidebarView } from '@/types';

interface PrimarySidebarProps {
  activeView: SidebarView;
  onViewChange: (view: SidebarView) => void;
  onCompile: () => void;
  onDeploy: () => void;
}

export default function PrimarySidebar({ 
  activeView, 
  onViewChange, 
  onCompile,
  onDeploy 
}: PrimarySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'files' as SidebarView, icon: FileCode2, label: 'Files', color: 'text-blue-400' },
    { id: 'compile' as SidebarView, icon: Play, label: 'Compile', color: 'text-green-400' },
    { id: 'deploy' as SidebarView, icon: Rocket, label: 'Deploy', color: 'text-purple-400' },
  ];

  return (
    <div className={`h-full bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      {/* Sidebar Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4">
        {isExpanded && (
          <h2 className="text-sm font-semibold text-gray-300">Explorer</h2>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          <ChevronRight 
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive 
                  ? 'bg-gray-800/50 border-l-2 border-blue-500' 
                  : 'hover:bg-gray-800/30'
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400'}`} />
              {isExpanded && (
                <span className={`text-sm ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="px-4 py-4">
          {activeView === 'files' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileCode2 className="w-4 h-4" />
                <span>HelloWorld.sol</span>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                File management coming soon...
              </p>
            </div>
          )}

          {activeView === 'compile' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Compile your Solidity contract to check for errors and generate bytecode.
              </p>
              <button
                onClick={onCompile}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/30"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Compile Contract</span>
              </button>
            </div>
          )}

          {activeView === 'deploy' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Deploy your compiled contract to VeChain TestNet with sponsored gas fees.
              </p>
              <button
                onClick={onDeploy}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/30"
              >
                <Rocket className="w-4 h-4" />
                <span className="text-sm font-medium">Deploy Contract</span>
              </button>
              <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 rounded p-2">
                ✨ Gas fees sponsored - deploy for free!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
