/** @format */

import express from 'express';
import tssPubkey from './mockData/tssPubkey.json';

const router = express.Router();

type TssPubkeyResponse = any;

router.get<{}, TssPubkeyResponse>('/', async (req, res) => {
  res.json(tssPubkey);
});

export default router;
