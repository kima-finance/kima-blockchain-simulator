/** @format */

import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import submit from './submit';
import status from './status';
import poolBalance from './poolBalance';
import availableChains from './availableChains';
import chain from './chain';
import tssPubkey from './tssPubkey';
import currencies from './currencies';
import fee from './fee';
import auth from './auth';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'KBS API - 👋🌎🌍🌏',
  });
});

router.use('/auth', auth);
router.use('/submit', submit);
router.use('/status', status);

// Stub Kima Finance API
router.use(
  '/kima-finance/kima-blockchain/transaction/transaction_data',
  status,
);

router.use('/kima-finance/kima-blockchain/chains/pool_balance', poolBalance);
router.use(
  '/kima-finance/kima-blockchain/chains/get_available_chains',
  availableChains,
);
router.use('/kima-finance/kima-blockchain/chains/chain', chain);
router.use('/kima-finance/kima-blockchain/kima/tss_pubkey', tssPubkey);
router.use('/kima-finance/kima-blockchain/chains/get_currencies', currencies);

router.use('/fee/', fee);

export default router;
