/** @format */

import express from 'express';
import chain from './mockData/chain.json';

const router = express.Router();

type ChainResponse = any;

router.get<{}, ChainResponse>('/', async (req, res) => {
  res.json(chain);
});

export default router;
