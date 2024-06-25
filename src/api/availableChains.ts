/** @format */

import express from 'express';
import chains from './mockData/chains.json';

const router = express.Router();

type AvailableChainsResponse = any;

router.get<{ chain: string }, AvailableChainsResponse>(
  '/:chain',
  async (req, res) => {
    const { chain } = req.params;

    res.json({ Chains: chains.Chains.filter((c: any) => c.chain !== chain) });
  },
);

export default router;
