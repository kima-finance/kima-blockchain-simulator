/** @format */

import express from 'express';
import poolBalance from './mockData/poolBalance.json';

const router = express.Router();

type PoolBalanceResponse = any;

router.get<{}, PoolBalanceResponse>('/', async (req, res) => {
  res.json(poolBalance);
});

export default router;
