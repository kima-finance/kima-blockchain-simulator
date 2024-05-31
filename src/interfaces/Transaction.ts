/** @format */

export interface Transaction {
  id: string;
  type: 'transfer';
  internalTransactions: {
    origin: {
      address: `0x${string}`;
      chainShortName: string;
      symbol: string;
      amount: number;
      fee: number;
      status: string;
      hash?: `0x${string}`;
    };
    target: {
      address: `0x${string}`;
      chainShortName: string;
      symbol: string;
      amount: number;
      status: string;
      hash?: `0x${string}`;
    };
  };
  data?: string;
  status: string;
}
