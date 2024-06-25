/** @format */

import express from 'express';

const router = express.Router();

type FeeResponse = any;

router.get<{ chain: string }, FeeResponse>('/:chain', async (req, res) => {
  res.json({ fee: '0-0' });
});

export default router;
