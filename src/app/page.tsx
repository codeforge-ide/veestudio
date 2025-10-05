'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import Header from '@/components/header/Header';
import PrimarySidebar from '@/components/sidebars/PrimarySidebar';
import AISidebar from '@/components/sidebars/AISidebar';
import { TerminalHandle } from '@/components/terminal/Terminal';
import { WalletState, SidebarView, Connex } from '@/types';
import { DEFAULT_CONTRACT } from '@/lib/constants';
import { generateContract, extractContractName } from '@/lib/ai';
import { getContractExplorerUrl } from '@/lib/vechain';

const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'), {
  ssr: false,
  loading: () => (
    <Box display="flex" alignItems="center" justifyContent="center" height="100%" bgcolor="background.default">
      Loading editor...
    </Box>
  ),
});

const Terminal = dynamic(() => import('@/components/terminal/Terminal'), {
  ssr: false,
  loading: () => <Box height="100%" bgcolor="background.default" />,
});

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CONTRACT);
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });
  const [activeView, setActiveView] = useState<SidebarView>('files');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [compiledData, setCompiledData] = useState<{ bytecode: string; abi: unknown[] } | null>(null);

  const terminalRef = useRef<TerminalHandle | null>(null);
  const connexRef = useRef<Connex | null>(null);

  const handleTerminalReady = useCallback((terminal: TerminalHandle) => {
    terminalRef.current = terminal;
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      terminalRef.current?.writeLine('Connecting to VeWorld wallet...', 'info');

      if (typeof window !== 'undefined' && window.connex) {
        const connex = window.connex;
        connexRef.current = connex;

        const signingService = connex.vendor.sign('cert', {
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

        terminalRef.current?.writeLine(`✓ Wallet connected: ${address}`, 'success');
        terminalRef.current?.writeLine(`✓ Network: ${network.toUpperCase()}NET`, 'info');
      } else {
        throw new Error('VeWorld wallet not detected. Please install VeWorld extension.');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      terminalRef.current?.writeLine('✗ Failed to connect wallet', 'error');
      throw error;
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
    terminalRef.current?.writeLine('✓ Wallet disconnected', 'info');
  }, []);

  const handleGenerateContract = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    terminalRef.current?.writeLine(`AI: Generating contract from prompt: "${prompt}"`, 'info');

    try {
      const result = await generateContract(prompt);
      setCode(result.code);
      terminalRef.current?.writeLine('✓ Contract generated successfully!', 'success');
      terminalRef.current?.writeLine(result.explanation, 'info');
    } catch (error) {
      console.error('Generation error:', error);
      terminalRef.current?.writeLine(`✗ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleCompile = useCallback(async () => {
    terminalRef.current?.writeLine('⚙ Compiling contract...', 'info');

    try {
      const contractName = extractContractName(code);
      
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, contractName }),
      });

      const data = await response.json();

      if (!data.success) {
        terminalRef.current?.writeLine('✗ Compilation failed!', 'error');
        terminalRef.current?.writeLine(data.details || data.error, 'error');
        return;
      }

      setCompiledData({ bytecode: data.bytecode, abi: data.abi });
      terminalRef.current?.writeLine('✓ Compilation successful!', 'success');
      terminalRef.current?.writeLine(`  Contract: ${data.contractName}`, 'info');
      
      if (data.warnings && data.warnings.length > 0) {
        terminalRef.current?.writeLine('⚠ Warnings:', 'warning');
        data.warnings.forEach((warning: string) => {
          terminalRef.current?.writeLine(`  ${warning}`, 'warning');
        });
      }
    } catch (error) {
      console.error('Compilation error:', error);
      terminalRef.current?.writeLine('✗ Compilation error', 'error');
    }
  }, [code]);

  const handleDeploy = useCallback(async () => {
    if (!wallet.connected) {
      terminalRef.current?.writeLine('✗ Please connect your wallet first', 'error');
      return;
    }

    setIsDeploying(true);
    terminalRef.current?.writeLine('🚀 Starting deployment process...', 'info');

    try {
      if (!compiledData) {
        terminalRef.current?.writeLine('⚙ Compiling contract...', 'info');
        const contractName = extractContractName(code);
        
        const compileResponse = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, contractName }),
        });

        const compileData = await compileResponse.json();

        if (!compileData.success) {
          terminalRef.current?.writeLine('✗ Compilation failed!', 'error');
          terminalRef.current?.writeLine(compileData.details || compileData.error, 'error');
          setIsDeploying(false);
          return;
        }

        terminalRef.current?.writeLine('✓ Compilation successful!', 'success');
        setCompiledData({ bytecode: compileData.bytecode, abi: compileData.abi });
        
        terminalRef.current?.writeLine('📝 Preparing deployment transaction...', 'info');
        
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
          terminalRef.current?.writeLine('✗ Deployment preparation failed!', 'error');
          terminalRef.current?.writeLine(deployData.error, 'error');
          setIsDeploying(false);
          return;
        }

        terminalRef.current?.writeLine('✓ Transaction prepared', 'info');

        if (connexRef.current) {
          terminalRef.current?.writeLine('📝 Requesting signature from VeWorld...', 'info');
          
          const signingService = connexRef.current.vendor.sign('tx', [deployData.transaction.clauses[0]]);

          if (deployData.delegatorSignature && signingService.delegate) {
            signingService.delegate(deployData.delegatorAddress, deployData.delegatorSignature);
            terminalRef.current?.writeLine('✨ Gas fees sponsored by VeeStudio!', 'success');
          }

          const result = await signingService.request();
          const txId = result.txid;

          terminalRef.current?.writeLine(`✓ Transaction signed! TX ID: ${txId}`, 'success');
          terminalRef.current?.writeLine('⏳ Waiting for confirmation...', 'info');

          const receipt = await connexRef.current.thor.transaction(txId).getReceipt();
          
          if (receipt) {
            const contractAddress = receipt.outputs[0]?.contractAddress;
            
            if (contractAddress) {
              terminalRef.current?.writeLine('🎉 Contract deployed successfully!', 'success');
              terminalRef.current?.writeLine(`📍 Contract Address: ${contractAddress}`, 'success');
              
              const explorerUrl = getContractExplorerUrl(wallet.network || 'test', contractAddress);
              terminalRef.current?.writeLine(`🔗 Explorer: ${explorerUrl}`, 'info');
            }
          }
        }
      }
    } catch (error) {
      console.error('Deployment error:', error);
      terminalRef.current?.writeLine(`✗ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsDeploying(false);
    }
  }, [wallet, code, compiledData]);

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden' }}>
      <Header
        wallet={wallet}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onDeploy={handleDeploy}
        isDeploying={isDeploying}
      />

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <PrimarySidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onCompile={handleCompile}
          onDeploy={handleDeploy}
        />

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flex: 1, overflow: 'hidden', borderRight: 1, borderBottom: 1, borderColor: 'divider' }}>
            <CodeEditor value={code} onChange={(value) => setCode(value || '')} />
          </Box>

          <Box sx={{ height: 192, borderRight: 1, borderColor: 'divider' }}>
            <Terminal onReady={handleTerminalReady} />
          </Box>
        </Box>

        <AISidebar
          onGenerateContract={handleGenerateContract}
          isGenerating={isGenerating}
        />
      </Box>
    </Box>
  );
}
