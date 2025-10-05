export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface CompileResult {
  success: boolean;
  bytecode?: string;
  abi?: unknown[];
  contractName?: string;
  error?: string;
}

export interface DeploymentResult {
  success: boolean;
  transaction?: unknown;
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

// Connex types
export interface ConnexVendor {
  sign: (type: string, data: unknown) => {
    request: () => Promise<{ txid: string; annex: { signer: string } }>;
    delegate?: (address: string, signature: string) => void;
  };
}

export interface ConnexThor {
  genesis: { id: string };
  transaction: (txId: string) => {
    getReceipt: () => Promise<{ outputs: { contractAddress?: string }[] } | null>;
  };
}

export interface Connex {
  vendor: ConnexVendor;
  thor: ConnexThor;
}

declare global {
  interface Window {
    connex?: Connex;
  }
}
