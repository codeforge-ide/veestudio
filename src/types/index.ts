export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface CompileResult {
  success: boolean;
  bytecode?: string;
  abi?: any[];
  contractName?: string;
  error?: string;
}

export interface DeploymentResult {
  success: boolean;
  transaction?: any;
  contractAddress?: string;
  txId?: string;
  error?: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: 'main' | 'test' | null;
}

export interface TerminalLine {
  id: string;
  content: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

export type SidebarView = 'files' | 'compile' | 'deploy';
