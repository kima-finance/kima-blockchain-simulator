/** @format */

import express from 'express';
import { addTransaction, generateId } from '../storage';
import { Transaction } from '../interfaces/Transaction';

const router = express.Router();

type SubmitResponse = {
  status: 'success' | 'error';
  transaction?: Transaction;
};

router.post<{}, SubmitResponse>('/', async (req, res) => {
  const {
    originAddress,
    originChain,
    targetAddress,
    targetChain,
    symbol,
    amount,
    fee,
    data,
  } = req.body;

  const id = generateId();

  const transaction: Transaction = {
    id,
    type: 'transfer',
    internalTransactions: {
      origin: {
        address: originAddress,
        chainShortName: originChain,
        symbol: symbol,
        amount: amount,
        fee: fee,
        status: 'pending',
      },
      target: {
        address: targetAddress,
        chainShortName: targetChain,
        symbol: symbol,
        amount: amount,
        status: 'pending',
      },
    },
    data,
    status: 'recorded',
  };

  addTransaction(transaction);

  res.json({ status: 'success', transaction });
});

export default router;
