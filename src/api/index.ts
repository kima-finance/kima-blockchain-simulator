/** @format */

import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import submit from './submit';
import status from './status';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'KBS API - 👋🌎🌍🌏',
  });
});

router.use('/submit', submit);
router.use('/status', status);

export default router;
