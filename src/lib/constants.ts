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

// Demo contract templates for fallback
export const DEMO_CONTRACTS: Record<string, string> = {
  counter: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 private count;
    
    event CountIncremented(uint256 newCount);
    event CountDecremented(uint256 newCount);
    event CountReset();
    
    constructor() {
        count = 0;
    }
    
    function increment() public {
        count += 1;
        emit CountIncremented(count);
    }
    
    function decrement() public {
        require(count > 0, "Counter is already at zero");
        count -= 1;
        emit CountDecremented(count);
    }
    
    function reset() public {
        count = 0;
        emit CountReset();
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}`,
  
  token: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "Simple Token";
    string public symbol = "SMPL";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(uint256 initialSupply) {
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}`,

  voting: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
        bool executed;
        mapping(address => bool) voters;
    }
    
    address public owner;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    
    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address indexed voter);
    event ProposalExecuted(uint256 indexed proposalId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function createProposal(string memory description) public onlyOwner {
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        newProposal.description = description;
        newProposal.voteCount = 0;
        newProposal.executed = false;
        emit ProposalCreated(proposalId, description);
    }
    
    function vote(uint256 proposalId) public {
        require(proposalId < proposalCount, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.voters[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.voters[msg.sender] = true;
        proposal.voteCount++;
        emit Voted(proposalId, msg.sender);
    }
    
    function executeProposal(uint256 proposalId) public onlyOwner {
        require(proposalId < proposalCount, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }
    
    function getProposalVotes(uint256 proposalId) public view returns (uint256) {
        require(proposalId < proposalCount, "Invalid proposal");
        return proposals[proposalId].voteCount;
    }
}`,

  storage: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    mapping(address => string) private userMessages;
    mapping(address => uint256) private userNumbers;
    
    event MessageStored(address indexed user, string message);
    event NumberStored(address indexed user, uint256 number);
    
    function storeMessage(string memory message) public {
        userMessages[msg.sender] = message;
        emit MessageStored(msg.sender, message);
    }
    
    function getMessage() public view returns (string memory) {
        return userMessages[msg.sender];
    }
    
    function storeNumber(uint256 number) public {
        userNumbers[msg.sender] = number;
        emit NumberStored(msg.sender, number);
    }
    
    function getNumber() public view returns (uint256) {
        return userNumbers[msg.sender];
    }
}`,

  nft: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleNFT {
    string public name = "Simple NFT";
    string public symbol = "SNFT";
    uint256 private tokenIdCounter;
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => string) public tokenURI;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Minted(address indexed to, uint256 indexed tokenId, string uri);
    
    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = tokenIdCounter++;
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        tokenURI[tokenId] = uri;
        
        emit Minted(to, tokenId, uri);
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }
    
    function transfer(address to, uint256 tokenId) public {
        require(ownerOf[tokenId] == msg.sender, "Not the owner");
        require(to != address(0), "Invalid address");
        
        balanceOf[msg.sender]--;
        balanceOf[to]++;
        ownerOf[tokenId] = to;
        
        emit Transfer(msg.sender, to, tokenId);
    }
    
    function totalSupply() public view returns (uint256) {
        return tokenIdCounter;
    }
}`,
};

// AI example prompts
export const EXAMPLE_PROMPTS = [
  'Create a simple counter contract with increment and decrement functions',
  'Build a token contract with basic ERC20 functionality',
  'Generate a voting contract where users can propose and vote on options',
  'Create a simple NFT contract for minting unique tokens',
  'Build a storage contract to save and retrieve user data',
  'Create a simple lottery contract',
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
