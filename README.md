# 🚀 VeeStudio - AI-Native IDE for VeChain

VeeStudio is a modern, web-based Integrated Development Environment (IDE) specifically designed for VeChain smart contract development. Built with Next.js and powered by AI, it provides a seamless experience from concept to deployed contract.

## ✨ Features

- **🤖 AI-Powered Contract Generation**: Generate smart contracts from natural language prompts
- **💸 Sponsored Deployments**: Deploy contracts without paying gas fees via VeChain's fee delegation
- **⚡ Lightning Fast**: Built on Next.js with instant hot reloading
- **🔧 Full-Featured Editor**: Monaco editor with Solidity syntax highlighting
- **📟 Integrated Terminal**: Real-time deployment logs and status updates
- **🦊 VeWorld Integration**: Seamless wallet connection using Connex
- **🎨 Beautiful UI**: Modern, glassmorphic design with dark theme

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (VS Code's editor)
- **Terminal**: xterm.js
- **Blockchain**: VeChain, Connex, thor-devkit
- **AI**: OpenAI GPT-4 / Gemini
- **Compiler**: solc-js

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- VeWorld browser extension (for wallet connection)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/veestudio.git
cd veestudio
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your configuration (optional):
```env
OPENAI_API_KEY=sk-your-key-here
ADMIN_PRIVATE_KEY=0xYourPrivateKeyHere
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Connecting Your Wallet

1. Click "Connect Wallet" in the top-right corner
2. Approve the connection in your VeWorld wallet
3. Your address and network will be displayed

### Generating Contracts with AI

1. Open the AI sidebar (right side)
2. Type a prompt like "Create a simple counter contract"
3. The AI will generate the contract code
4. The code will automatically appear in the editor

### Compiling Contracts

1. Click the "Compile" tab in the left sidebar
2. Click "Compile Contract"
3. Check the terminal for compilation results

### Deploying Contracts

1. Ensure your wallet is connected
2. Click the "Deploy" button in the header
3. Sign the transaction in VeWorld (gas is sponsored!)
4. View your deployed contract in the terminal

## 🏗️ Project Structure

```
veestudio/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── compile/       # Contract compilation
│   │   │   ├── deploy/        # Contract deployment
│   │   │   └── ai/generate/   # AI contract generation
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main IDE page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── editor/            # Code editor
│   │   ├── sidebars/          # Sidebar components
│   │   ├── terminal/          # Terminal component
│   │   ├── header/            # Header component
│   │   └── ui/                # UI components
│   ├── lib/                   # Utility functions
│   │   ├── constants.ts       # App constants
│   │   ├── ai.ts              # AI utilities
│   │   └── vechain.ts         # VeChain utilities
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── blueprint.md               # Project blueprint
├── prd.md                     # Product requirements
└── README.md                  # This file
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI generation | No* |
| `GEMINI_API_KEY` | Alternative to OpenAI | No* |
| `ADMIN_PRIVATE_KEY` | Private key for fee delegation | No** |
| `VECHAIN_NODE_URL` | VeChain node URL | No*** |
| `NEXT_PUBLIC_VECHAIN_NETWORK` | Network (test/main) | No*** |

\* If not provided, template-based generation will be used  
\** If not provided, users will pay their own gas fees  
\*** Defaults to TestNet

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/veestudio)

1. Click the button above
2. Configure environment variables
3. Deploy!

### Deploy to Other Platforms

VeeStudio is a standard Next.js app and can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- VeChain Foundation for the amazing blockchain platform
- OpenAI for GPT-4 API
- Microsoft for Monaco Editor
- The Next.js team for the fantastic framework

## 📞 Support

- GitHub Issues: [Create an issue](https://github.com/yourusername/veestudio/issues)
- Discord: [Join our community](#)
- Twitter: [@veestudio](#)

---

Built with ❤️ for the VeChain community
