'use client';

import React from 'react';
import Image from 'next/image';
import { Rocket, Wallet, LogOut } from 'lucide-react';
import { WalletState } from '@/types';
import { truncateAddress } from '@/lib/vechain';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  wallet: WalletState;
  onConnect: () => void;
  onDeploy: () => void;
  isDeploying: boolean;
}

export default function Header({ wallet, onConnect, onDeploy, isDeploying }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-50"></div>
          <div className="relative bg-gray-900 p-2 rounded-lg border border-gray-800">
            <Image 
              src="/veestudio.png" 
              alt="VeeStudio" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            VeeStudio
          </h1>
          <p className="text-xs text-gray-500">VeChain IDE</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Network Badge */}
        {wallet.connected && wallet.network && (
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium uppercase">
              {wallet.network}net
            </span>
          </div>
        )}

        {/* Auth Status */}
        {isAuthenticated && user && (
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-blue-400 font-medium">
              Authenticated
            </span>
          </div>
        )}

        {/* Wallet Button */}
        {wallet.connected ? (
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300 font-mono">
                {truncateAddress(wallet.address || '')}
              </span>
            </div>
            {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={logout} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <Button variant="secondary" size="md" onClick={onConnect}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        {/* Deploy Button */}
        <Button
          variant="primary"
          size="md"
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
