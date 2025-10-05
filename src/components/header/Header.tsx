'use client';

import React from 'react';
import { Rocket, Wallet, Zap } from 'lucide-react';
import { WalletState } from '@/types';
import { truncateAddress } from '@/lib/vechain';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  wallet: WalletState;
  onConnect: () => void;
  onDeploy: () => void;
  isDeploying: boolean;
}

export default function Header({ wallet, onConnect, onDeploy, isDeploying }: HeaderProps) {
  return (
    <header className="h-14 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-50"></div>
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            VeeStudio
          </h1>
          <p className="text-xs text-gray-500">VeChain IDE</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Network Badge */}
        {wallet.connected && wallet.network && (
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium uppercase">
              {wallet.network}net
            </span>
          </div>
        )}

        {/* Wallet Button */}
        {wallet.connected ? (
          <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 font-mono">
              {truncateAddress(wallet.address || '')}
            </span>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={onConnect}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        {/* Deploy Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onDeploy}
          disabled={isDeploying || !wallet.connected}
        >
          <Rocket className="w-4 h-4 mr-2" />
          {isDeploying ? 'Deploying...' : 'Deploy'}
        </Button>
      </div>
    </header>
  );
}
