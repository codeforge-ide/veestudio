import { NextRequest, NextResponse } from 'next/server';
import { Transaction, secp256k1, blake2b256 } from 'thor-devkit';

export async function POST(request: NextRequest) {
  try {
    const { bytecode, userAddress } = await request.json();

    if (!bytecode || !userAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // VeChain TestNet configuration
    const nodeUrl = process.env.VECHAIN_NODE_URL || 'https://testnet.vechain.org';
    const chainTag = 39; // TestNet
    
    // Get the latest block for creating the transaction
    const blockResponse = await fetch(`${nodeUrl}/blocks/best`);
    const block = await blockResponse.json();
    
    const blockRef = block.id.slice(0, 18); // First 8 bytes of block ID

    // Create the deployment clause
    const clause = {
      to: null, // null for contract creation
      value: '0x0',
      data: bytecode,
    };

    // Build the transaction body
    const txBody = {
      chainTag,
      blockRef,
      expiration: 32, // 32 blocks expiration (~8 minutes)
      clauses: [clause],
      gasPriceCoef: 0,
      gas: 3000000, // Generous gas limit for deployment
      dependsOn: null,
      nonce: '0x' + Math.random().toString(16).slice(2, 18), // Random nonce
    };

    // Check if we have an admin private key for fee delegation
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
    
    if (adminPrivateKey) {
      // Fee delegation mode - admin sponsors the gas
      try {
        const adminKey = Buffer.from(adminPrivateKey.replace('0x', ''), 'hex');
        const adminAddress = '0x' + blake2b256(secp256k1.derivePublicKey(adminKey)).slice(-20).toString('hex');

        // Add reserved fields for fee delegation
        const txWithDelegation = {
          ...txBody,
          reserved: {
            features: 1, // Enable VIP-191 fee delegation
          },
        };

        // Sign the transaction with admin key for gas payment
        const tx = new Transaction(txWithDelegation as never);
        const signingHash = tx.signingHash();
        const adminSignature = secp256k1.sign(signingHash, adminKey);

        return NextResponse.json({
          success: true,
          transaction: txWithDelegation,
          delegatorSignature: '0x' + adminSignature.toString('hex'),
          delegatorAddress: adminAddress,
          message: 'Transaction prepared with fee delegation. Please sign with your wallet.',
        });
      } catch (delegationError) {
        console.error('Fee delegation setup error:', delegationError);
        // Fall back to regular transaction
      }
    }

    // Regular mode - user pays gas
    return NextResponse.json({
      success: true,
      transaction: txBody,
      message: 'Transaction prepared. Please sign with your wallet.',
    });
  } catch (error) {
    console.error('Deployment preparation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to prepare deployment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
