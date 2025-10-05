// VeChain utilities and helpers

export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function getExplorerUrl(network: 'main' | 'test', txId: string): string {
  const baseUrl = network === 'main' 
    ? 'https://explore.vechain.org' 
    : 'https://explore-testnet.vechain.org';
  return `${baseUrl}/transactions/${txId}`;
}

export function getContractExplorerUrl(network: 'main' | 'test', address: string): string {
  const baseUrl = network === 'main' 
    ? 'https://explore.vechain.org' 
    : 'https://explore-testnet.vechain.org';
  return `${baseUrl}/accounts/${address}`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}
