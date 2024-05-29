/** @format */

import express from 'express';
import { generateId, transactionRegistry } from '../storage';

const router = express.Router();

type SubmitResponse = {
  status: 'success' | 'error';
  id?: string;
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

  transactionRegistry.push({
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
  });

  res.json({ status: 'success', id });
});

export default router;
