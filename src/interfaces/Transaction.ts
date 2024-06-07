/** @format */

export interface Transaction {
  id: string;
  type: 'transfer' | 'dvp';
  internalTransactions: {
    type: 'inbound' | 'outbound' | 'inbound_reverted' | 'outbound_reverted';
    address: `0x${string}`;
    chainShortName: string;
    symbol: string;
    amount: number;
    fee: number;
    status: string;
    hash?: `0x${string}`;
  }[];
  data?: string;
  status: string;
}
