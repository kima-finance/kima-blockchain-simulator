/** @format */

import express from 'express';
import { Transaction } from '../interfaces/Transaction';
import { getTransaction } from '../storage';

const router = express.Router();

type StatusResponse = {
  transaction: Transaction | null;
};

router.get<{ transactionId: string }, StatusResponse>(
  '/:transactionId',
  async (req, res) => {
    const { transactionId } = req.params;

    if (!transactionId) {
      res.status(400).json({ transaction: null });
      return;
    }

    const transaction = getTransaction(transactionId as `0x${string}`);

    if (!transaction) {
      res.status(404).json({ transaction: null });
      return;
    }

    res.json({ transaction });
  },
);

export default router;
