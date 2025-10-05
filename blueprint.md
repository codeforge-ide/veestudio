# VeeStudio Blueprint

## Overview
VeeStudio is an AI-native, web-based IDE built specifically for the VeChain ecosystem. It provides a seamless, browser-based development environment that enables developers to go from concept to deployed smart contract with unprecedented velocity. The application leverages VeChain's unique features like fee delegation (sponsored transactions) to create a frictionless deployment experience.

## Core Capabilities
- **Dual-Sidebar Layout**: Primary sidebar (left) for file management and tools; AI sidebar (right) for intelligent assistance
- **Monaco Code Editor**: Full-featured code editing with syntax highlighting for Solidity
- **AI Assistant**: Generate smart contracts from natural language prompts using LLM integration
- **One-Click Sponsored Deployment**: Deploy contracts without paying gas fees via VeChain's fee delegation
- **Integrated Terminal**: Real-time deployment status and logs using xterm.js
- **VeWorld Wallet Integration**: Seamless wallet connection using Connex for transaction signing

## Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Terminal**: xterm.js with fit addon
- **Blockchain**: @vechain/connex for wallet integration
- **State Management**: React hooks and context
- **UI Components**: Custom components with shadcn/ui design principles

### Backend Stack
- **API Routes**: Next.js API routes for contract compilation and deployment
- **Compilation**: solc-js for Solidity compilation
- **Blockchain SDK**: thor-devkit for transaction building and signing
- **Fee Delegation**: Admin wallet for sponsoring user transactions

## Project Structure
```
veestudio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Main IDE interface
│   │   ├── globals.css             # Global styles
│   │   └── api/
│   │       ├── compile/
│   │       │   └── route.ts        # Contract compilation endpoint
│   │       └── deploy/
│   │           └── route.ts        # Contract deployment endpoint
│   ├── components/
│   │   ├── editor/
│   │   │   └── CodeEditor.tsx      # Monaco editor wrapper
│   │   ├── sidebars/
│   │   │   ├── PrimarySidebar.tsx  # Left sidebar (files, compile, deploy)
│   │   │   └── AISidebar.tsx       # Right sidebar (AI assistant)
│   │   ├── terminal/
│   │   │   └── Terminal.tsx        # xterm.js terminal component
│   │   ├── header/
│   │   │   └── Header.tsx          # Top header with wallet connection
│   │   └── ui/
│   │       └── [various UI components]
│   ├── lib/
│   │   ├── constants.ts            # App constants and config
│   │   ├── ai.ts                   # AI/LLM integration
│   │   └── vechain.ts              # VeChain utilities
│   └── types/
│       └── index.ts                # TypeScript type definitions
└── public/
    └── contracts/
        └── HelloWorld.sol          # Default contract template
```

## Features Implemented (MVP - P0)

### 1. Application Shell & Layout
- **Clean, distraction-free interface** that loads directly into the IDE
- **Three-column layout**: Primary sidebar (left), editor (center), AI sidebar (right)
- **Bottom terminal panel** for deployment logs and status
- **Top header** with branding, wallet connection, and deploy button

### 2. Code Editor (Monaco Editor)
- Full Solidity syntax highlighting and IntelliSense
- Pre-loaded with a "Hello World" smart contract template
- Auto-save to local state
- Theme support (VS Code Dark theme)
- Line numbers and minimap

### 3. AI Assistant (Right Sidebar)
- **Chat interface** with message history
- **Contract generation** from natural language prompts
- Integration with OpenAI/Gemini APIs
- **Real-time streaming** of AI responses
- Automatic code replacement in editor
- Example prompts for quick start

### 4. Primary Sidebar (Left)
- **File tree view** (placeholder for MVP, showing current contract)
- **Compile button** to validate Solidity code
- **Deploy tab** with contract interaction UI (post-deployment)
- Icon-based navigation with tooltips

### 5. One-Click Sponsored Deployment
- **Backend compilation**: API route that compiles Solidity using solc-js
- **Fee delegation**: Admin wallet sponsors transaction gas costs
- **Connex integration**: Opens VeWorld wallet for user signature
- **Transaction tracking**: Real-time status updates in terminal
- **Success confirmation**: Deployed contract address and block explorer link

### 6. Terminal Integration
- xterm.js terminal at the bottom of the IDE
- Real-time logging of:
  - Compilation status
  - Deployment progress
  - Transaction hashes
  - Contract addresses
  - Error messages
- Color-coded output (success = green, error = red, info = blue)

### 7. Wallet Connection
- **Connect Wallet button** in header
- VeWorld wallet integration via Connex
- Display connected address (truncated)
- Network indicator (TestNet/MainNet)
- Disconnect functionality

## Design & Styling

### Color Palette
- **Background**: Deep dark theme (#0a0a0a, #111111)
- **Primary**: VeChain blue (#4A90E2, #2196F3)
- **Accent**: Electric purple (#8B5CF6)
- **Success**: Emerald green (#10B981)
- **Error**: Vibrant red (#EF4444)
- **Text**: High contrast whites and grays

### Typography
- **Primary Font**: Inter (system fallback)
- **Code Font**: JetBrains Mono, Fira Code
- **Hierarchy**: Large hero text for headers, clear section titles, readable body text

### Visual Effects
- **Glassmorphism**: Frosted glass effect on sidebars and panels
- **Drop Shadows**: Multi-layered shadows for depth
- **Gradients**: Subtle gradients on buttons and accent elements
- **Hover States**: Smooth transitions and glow effects
- **Loading States**: Animated pulse and skeleton screens

### Iconography
- Lucide icons for consistent, modern look
- File type icons for the file tree
- Status icons for deployment stages
- Action icons for buttons

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- High contrast text and UI elements
- Focus indicators
- Screen reader compatible

## Current Implementation Status

### ✅ Completed
- Next.js project setup with TypeScript and Tailwind CSS
- Application shell and responsive layout
- Monaco editor integration with Solidity support
- AI sidebar with chat interface
- Primary sidebar structure
- Terminal component with xterm.js
- Header with wallet connection UI
- API routes for compilation and deployment

### 🚧 In Progress
- VeChain Connex wallet integration
- Fee delegation implementation
- AI contract generation (LLM integration)
- Terminal logging integration

### 📋 Next Steps (P1)
- Retractable/collapsible sidebars
- File tree navigation
- Contract templates library
- Deployment history

### 🔮 Future Vision (P2+)
- Appwrite integration for user auth and project storage
- RxDB for offline-first functionality
- Advanced AI features (code explanation, optimization, testing)
- Git integration
- Multi-file project support
- Plugin system

## API Endpoints

### POST /api/compile
Compiles Solidity code and returns bytecode and ABI.

**Request Body:**
```json
{
  "code": "pragma solidity ^0.8.0; contract Hello { ... }",
  "contractName": "Hello"
}
```

**Response:**
```json
{
  "success": true,
  "bytecode": "0x608060...",
  "abi": [...],
  "contractName": "Hello"
}
```

### POST /api/deploy
Creates a sponsored deployment transaction for user to sign.

**Request Body:**
```json
{
  "bytecode": "0x608060...",
  "abi": [...],
  "userAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "clauses": [...],
    "gas": 200000,
    "gasPriceCoef": 0,
    "dependsOn": null,
    "nonce": "0x..."
  }
}
```

### POST /api/ai/generate
Generates smart contract code from natural language prompt.

**Request Body:**
```json
{
  "prompt": "Create a simple counter contract"
}
```

**Response:**
```json
{
  "success": true,
  "code": "pragma solidity ^0.8.0; ...",
  "explanation": "This contract implements..."
}
```

## Environment Variables
```
OPENAI_API_KEY=sk-...              # For AI contract generation
GEMINI_API_KEY=...                 # Alternative to OpenAI
ADMIN_PRIVATE_KEY=0x...            # For fee delegation
VECHAIN_NODE_URL=https://testnet.vechain.org
NEXT_PUBLIC_VECHAIN_NETWORK=test   # test | main
```

## Development Workflow
1. Run `npm install` to install dependencies
2. Set up environment variables in `.env.local`
3. Run `npm run dev` to start development server
4. Make changes and test in browser
5. Run `npm run lint` to check code quality
6. Run `npm run build` to create production build

## Key User Flows

### Flow 1: Generate Contract with AI
1. User types prompt in AI sidebar: "Create a token contract"
2. AI processes prompt and generates Solidity code
3. Generated code automatically appears in Monaco editor
4. User can review and edit the code

### Flow 2: Deploy Contract
1. User writes or generates contract code
2. User clicks "Deploy" button in header
3. Backend compiles code and creates sponsored transaction
4. VeWorld wallet modal opens for signature
5. User signs transaction (no gas fee)
6. Terminal shows deployment progress
7. Contract address and explorer link displayed

### Flow 3: Connect Wallet
1. User clicks "Connect Wallet" button
2. Connex triggers VeWorld wallet connection
3. User approves connection in wallet
4. Address and network displayed in header

## Success Metrics
- Time from landing to deployed contract: < 2 minutes
- AI contract generation accuracy: > 90%
- Deployment success rate: > 95%
- Page load time: < 2 seconds
- User retention: Measure return visits

## Demo Script (2 Minutes)
1. **[0:00-0:15]** Open VeeStudio - show clean, professional IDE interface
2. **[0:15-0:45]** Use AI to generate a contract: "Create a simple voting contract"
3. **[0:45-1:15]** Review generated code, make minor edit
4. **[1:15-1:45]** Click Deploy, sign with wallet (emphasize no gas fee)
5. **[1:45-2:00]** Show deployed contract on block explorer, celebrate!

---

*This blueprint serves as the single source of truth for VeeStudio development. It will be updated as features are implemented and requirements evolve.*
