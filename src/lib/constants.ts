// App constants and configuration

export const APP_NAME = 'VeeStudio';
export const APP_VERSION = '0.1.0';

// VeChain network configuration
export const VECHAIN_NETWORKS = {
  main: {
    url: 'https://mainnet.vechain.org',
    chainTag: 74,
    explorer: 'https://explore.vechain.org',
  },
  test: {
    url: 'https://testnet.vechain.org',
    chainTag: 39,
    explorer: 'https://explore-testnet.vechain.org',
  },
};

export const DEFAULT_NETWORK = 'test';

// Default contract template
export const DEFAULT_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HelloWorld
 * @dev A simple smart contract to store and retrieve a message
 */
contract HelloWorld {
    string private message;
    
    event MessageUpdated(string newMessage, address updater);
    
    constructor() {
        message = "Hello, VeChain!";
    }
    
    /**
     * @dev Updates the stored message
     * @param newMessage The new message to store
     */
    function setMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageUpdated(newMessage, msg.sender);
    }
    
    /**
     * @dev Returns the stored message
     * @return The current message
     */
    function getMessage() public view returns (string memory) {
        return message;
    }
}`;

// AI example prompts
export const EXAMPLE_PROMPTS = [
  'Create a simple counter contract with increment and decrement functions',
  'Build a token contract with basic ERC20 functionality',
  'Generate a voting contract where users can propose and vote on options',
  'Create a simple NFT contract for minting unique tokens',
];

// Terminal welcome message
export const TERMINAL_WELCOME = `Welcome to ${APP_NAME} Terminal
Type 'help' for available commands
Ready for deployment...
`;

// Monaco editor options
export const EDITOR_OPTIONS = {
  minimap: { enabled: true },
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  lineNumbers: 'on' as const,
  roundedSelection: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 4,
  wordWrap: 'on' as const,
};
