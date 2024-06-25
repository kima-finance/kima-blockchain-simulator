/** @format */

import express from 'express';
import currencies from './mockData/currencies.json';

const router = express.Router();

type CurrenciesResponse = any;

router.get<{ originChain: string; targetChain: string }, CurrenciesResponse>(
  '/:originChain/:targetChain',
  async (req, res) => {
    res.json(currencies);
  },
);

export default router;
