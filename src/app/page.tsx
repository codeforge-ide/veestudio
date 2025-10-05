'use client';

import React, { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/header/Header';
import PrimarySidebar from '@/components/sidebars/PrimarySidebar';
import AISidebar from '@/components/sidebars/AISidebar';
import { WalletState, SidebarView } from '@/types';
import { DEFAULT_CONTRACT } from '@/lib/constants';
import { generateContract, extractContractName } from '@/lib/ai';
import { getExplorerUrl, getContractExplorerUrl } from '@/lib/vechain';

// Dynamic imports for client-side only components
const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-900 flex items-center justify-center">
    <div className="text-gray-400">Loading editor...</div>
  </div>,
});

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-900"></div>,
});

export default function Home() {
  // State management
  const [code, setCode] = useState(DEFAULT_CONTRACT);
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [activeView, setActiveView] = useState<SidebarView>('files');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [compiledData, setCompiledData] = useState<{ bytecode: string; abi: any[] } | null>(null);

  const terminalRef = useRef<any>(null);
  const connexRef = useRef<any>(null);

  // Terminal ready handler
  const handleTerminalReady = useCallback((terminal: any) => {
    terminalRef.current = terminal;
  }, []);

  // Wallet connection handler
  const handleConnect = useCallback(async () => {
    try {
      terminalRef.current?.writeLine('Connecting to VeWorld wallet...', 'info');

      // Initialize Connex
      if (typeof window !== 'undefined' && (window as any).connex) {
        const connex = (window as any).connex;
        connexRef.current = connex;

        // Get the current wallet address
        const vendor = connex.vendor;
        const signingService = vendor.sign('cert', {
          purpose: 'identification',
          payload: {
            type: 'text',
            content: 'Connect to VeeStudio',
          },
        });

        const result = await signingService.request();
        const address = result.annex.signer;

        const network = connex.thor.genesis.id === '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a'
          ? 'main'
          : 'test';

        setWallet({
          connected: true,
          address,
          network,
        });

        terminalRef.current?.writeLine(`Wallet connected: ${address}`, 'success');
        terminalRef.current?.writeLine(`Network: ${network.toUpperCase()}NET`, 'info');
      } else {
        terminalRef.current?.writeLine('VeWorld wallet not detected. Please install VeWorld extension.', 'error');
        alert('VeWorld wallet not detected. Please install the VeWorld browser extension.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      terminalRef.current?.writeLine('Failed to connect wallet', 'error');
    }
  }, []);

  // AI contract generation handler
  const handleGenerateContract = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    terminalRef.current?.writeLine(`AI: Generating contract from prompt: "${prompt}"`, 'info');

    try {
      const result = await generateContract(prompt);
      setCode(result.code);
      terminalRef.current?.writeLine('Contract generated successfully!', 'success');
      terminalRef.current?.writeLine(result.explanation, 'info');
    } catch (error) {
      console.error('Generation error:', error);
      terminalRef.current?.writeLine(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Compile handler
  const handleCompile = useCallback(async () => {
    terminalRef.current?.writeLine('Compiling contract...', 'info');

    try {
      const contractName = extractContractName(code);
      
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, contractName }),
      });

      const data = await response.json();

      if (!data.success) {
        terminalRef.current?.writeLine('Compilation failed!', 'error');
        terminalRef.current?.writeLine(data.details || data.error, 'error');
        return;
      }

      setCompiledData({ bytecode: data.bytecode, abi: data.abi });
      terminalRef.current?.writeLine('Compilation successful!', 'success');
      terminalRef.current?.writeLine(`Contract: ${data.contractName}`, 'info');
      
      if (data.warnings && data.warnings.length > 0) {
        terminalRef.current?.writeLine('Warnings:', 'warning');
        data.warnings.forEach((warning: string) => {
          terminalRef.current?.writeLine(warning, 'warning');
        });
      }
    } catch (error) {
      console.error('Compilation error:', error);
      terminalRef.current?.writeLine('Compilation error', 'error');
    }
  }, [code]);

  // Deploy handler
  const handleDeploy = useCallback(async () => {
    if (!wallet.connected) {
      terminalRef.current?.writeLine('Please connect your wallet first', 'error');
      return;
    }

    setIsDeploying(true);
    terminalRef.current?.writeLine('Starting deployment process...', 'info');

    try {
      // Step 1: Compile if not already compiled
      if (!compiledData) {
        terminalRef.current?.writeLine('Compiling contract...', 'info');
        const contractName = extractContractName(code);
        
        const compileResponse = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, contractName }),
        });

        const compileData = await compileResponse.json();

        if (!compileData.success) {
          terminalRef.current?.writeLine('Compilation failed!', 'error');
          terminalRef.current?.writeLine(compileData.details || compileData.error, 'error');
          setIsDeploying(false);
          return;
        }

        terminalRef.current?.writeLine('Compilation successful!', 'success');
        setCompiledData({ bytecode: compileData.bytecode, abi: compileData.abi });
        
        // Step 2: Prepare deployment transaction
        terminalRef.current?.writeLine('Preparing deployment transaction...', 'info');
        
        const deployResponse = await fetch('/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bytecode: compileData.bytecode,
            abi: compileData.abi,
            userAddress: wallet.address,
          }),
        });

        const deployData = await deployResponse.json();

        if (!deployData.success) {
          terminalRef.current?.writeLine('Deployment preparation failed!', 'error');
          terminalRef.current?.writeLine(deployData.error, 'error');
          setIsDeploying(false);
          return;
        }

        terminalRef.current?.writeLine(deployData.message, 'info');

        // Step 3: Sign and send transaction via Connex
        if (connexRef.current) {
          terminalRef.current?.writeLine('Requesting signature from VeWorld...', 'info');
          
          const vendor = connexRef.current.vendor;
          const signingService = vendor.sign('tx', [deployData.transaction.clauses[0]]);

          if (deployData.delegatorSignature) {
            // Add fee delegation signature
            signingService.delegate(deployData.delegatorAddress, deployData.delegatorSignature);
            terminalRef.current?.writeLine('✨ Gas fees sponsored by VeeStudio!', 'success');
          }

          const result = await signingService.request();
          const txId = result.txid;

          terminalRef.current?.writeLine(`Transaction signed! TX ID: ${txId}`, 'success');
          terminalRef.current?.writeLine('Waiting for transaction confirmation...', 'info');

          // Wait for transaction receipt
          const receipt = await connexRef.current.thor.transaction(txId).getReceipt();
          
          if (receipt) {
            const contractAddress = receipt.outputs[0]?.contractAddress;
            
            if (contractAddress) {
              terminalRef.current?.writeLine('🎉 Contract deployed successfully!', 'success');
              terminalRef.current?.writeLine(`Contract Address: ${contractAddress}`, 'success');
              
              const explorerUrl = getContractExplorerUrl(wallet.network || 'test', contractAddress);
              terminalRef.current?.writeLine(`View on explorer: ${explorerUrl}`, 'info');
            }
          }
        }
      }
    } catch (error) {
      console.error('Deployment error:', error);
      terminalRef.current?.writeLine(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsDeploying(false);
    }
  }, [wallet, code, compiledData]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* Header */}
      <Header
        wallet={wallet}
        onConnect={handleConnect}
        onDeploy={handleDeploy}
        isDeploying={isDeploying}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Primary Sidebar */}
        <PrimarySidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onCompile={handleCompile}
          onDeploy={handleDeploy}
        />

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden border-r border-b border-gray-800">
            <CodeEditor value={code} onChange={(value) => setCode(value || '')} />
          </div>

          {/* Terminal */}
          <div className="h-48 border-r border-gray-800">
            <Terminal onReady={handleTerminalReady} />
          </div>
        </div>

        {/* AI Sidebar */}
        <AISidebar
          onGenerateContract={handleGenerateContract}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
