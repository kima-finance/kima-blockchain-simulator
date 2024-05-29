/** @format */

type Transaction = {
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
};

export const transactionRegistry: Transaction[] = [];

export const generateId = () => '0x' + Math.random().toString(16).slice(2);

export const getTransactionById = (id: string) =>
  transactionRegistry.find((transaction) => transaction.id === id);
