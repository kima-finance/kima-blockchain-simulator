/** @format */

import express from 'express';

const router = express.Router();

type AuthResponse = any;

router.post<{}, AuthResponse>('/', async (req, res) => {
  res.send('ok');
});

export default router;
