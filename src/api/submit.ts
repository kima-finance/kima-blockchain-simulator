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
    originAmount,
    originSymbol,
    targetAddress,
    targetChain,
    targetAmount,
    targetSymbol,
    fee,
    data,
  } = req.body;

  const id = generateId();
  let transaction: Transaction;

  if (originSymbol !== targetSymbol) {
    transaction = {
      id,
      type: 'dvp',
      internalTransactions: [
        {
          type: 'inbound',
          address: originAddress,
          chainShortName: originChain,
          symbol: originSymbol,
          amount: originAmount,
          fee: fee,
          status: 'pending',
        },
        {
          type: 'inbound',
          address: targetAddress,
          chainShortName: targetChain,
          symbol: targetSymbol,
          amount: targetAmount,
          fee: fee,
          status: 'pending',
        },
        {
          type: 'outbound',
          address: targetAddress,
          chainShortName: originChain,
          symbol: originSymbol,
          amount: originAmount,
          fee: fee,
          status: 'pending',
        },
        {
          type: 'outbound',
          address: originAddress,
          chainShortName: targetChain,
          symbol: targetSymbol,
          amount: targetAmount,
          fee: fee,
          status: 'pending',
        },
      ],
      data,
      status: 'recorded',
    };
  } else {
    transaction = {
      id,
      type: 'transfer',
      internalTransactions: [
        {
          type: 'inbound',
          address: originAddress,
          chainShortName: originChain,
          symbol: originSymbol,
          amount: originAmount,
          fee: fee,
          status: 'pending',
        },
        {
          type: 'outbound',
          address: targetAddress,
          chainShortName: targetChain,
          symbol: targetSymbol,
          amount: targetAmount,
          fee: fee,
          status: 'pending',
        },
      ],
      data,
      status: 'recorded',
    };
  }

  addTransaction(transaction);

  res.json({ status: 'success', transaction });
});

export default router;
