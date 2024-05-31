/** @format */

import express from 'express';
import { Transaction } from '../interfaces/Transaction';
import { getTransaction } from '../storage';

const router = express.Router();

type StatusResponse = {
  transaction: Transaction | null;
};

router.get<{}, StatusResponse>('/', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ transaction: null });
    return;
  }

  const transaction = getTransaction(id as `0x${string}`);

  if (!transaction) {
    res.status(404).json({ transaction: null });
    return;
  }

  res.json({ transaction });
});

export default router;
