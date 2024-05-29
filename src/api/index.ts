/** @format */

import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import submit from './submit';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'KBS API - 👋🌎🌍🌏',
  });
});

router.use('/submit', submit);

export default router;
