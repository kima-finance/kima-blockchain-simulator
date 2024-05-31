/** @format */
import * as fs from 'fs';
import { Transaction } from '../interfaces/Transaction';

export const getTransactions = (): Transaction[] => {
  if (!fs.existsSync('txs.json')) {
    fs.writeFileSync('txs.json', JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync('txs.json', 'utf8'));
};

export const getTransaction = (id: `0x${string}`) => {
  return getTransactions().find((transaction) => transaction.id === id);
};

export const addTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  fs.writeFileSync('txs.json', JSON.stringify(transactions));
};

export const updateTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === transaction.id);
  transactions[index] = transaction;
  fs.writeFileSync('txs.json', JSON.stringify(transactions));
};

export const generateId = () => '0x' + Math.random().toString(16).slice(2);
