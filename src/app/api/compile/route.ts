import { NextRequest, NextResponse } from 'next/server';
import solc from 'solc';

export async function POST(request: NextRequest) {
  try {
    const { code, contractName } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No code provided' },
        { status: 400 }
      );
    }

    // Prepare the input for the Solidity compiler
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: code,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode.object'],
          },
        },
      },
    };

    // Compile the contract
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for errors
    if (output.errors) {
      const errors = output.errors.filter((error: any) => error.severity === 'error');
      if (errors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Compilation failed',
            details: errors.map((e: any) => e.formattedMessage).join('\n'),
          },
          { status: 400 }
        );
      }
    }

    // Extract the compiled contract
    const contracts = output.contracts['contract.sol'];
    const contractNames = Object.keys(contracts);
    
    if (contractNames.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No contract found in the code' },
        { status: 400 }
      );
    }

    // Use the specified contract name or the first one found
    const targetContractName = contractName || contractNames[0];
    const contract = contracts[targetContractName];

    if (!contract) {
      return NextResponse.json(
        { success: false, error: `Contract "${targetContractName}" not found` },
        { status: 400 }
      );
    }

    const bytecode = '0x' + contract.evm.bytecode.object;
    const abi = contract.abi;

    return NextResponse.json({
      success: true,
      bytecode,
      abi,
      contractName: targetContractName,
      warnings: output.errors
        ?.filter((e: any) => e.severity === 'warning')
        .map((e: any) => e.formattedMessage) || [],
    });
  } catch (error) {
    console.error('Compilation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
