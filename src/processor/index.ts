/** @format */

import { createPublicClient } from 'viem';
import { transferFrom, transferTo } from '../transactions';
import { getChainByShortName } from '../chains';
import { getTransactions, updateTransaction } from '../storage';
import { Transaction } from '../interfaces/Transaction';
import { getTrasportForChainShortName } from '../config/tokens';

const recordedHandler = async (transaction: Transaction) => {
  await Promise.all(
    transaction.internalTransactions
      .filter((internalTransaction) => internalTransaction.type === 'inbound')
      .map(async (internalTransaction) => {
        const hash = await transferFrom({
          originAddress: internalTransaction.address,
          originChainShortName: internalTransaction.chainShortName,
          symbol: internalTransaction.symbol,
          amount: internalTransaction.amount,
          fee: internalTransaction.fee,
        });
        internalTransaction.hash = hash;
        internalTransaction.status = 'pending';
      }),
  );
  transaction.status = 'inbound_pending';
  updateTransaction(transaction);
};

const inboundPendingHandler = async (transaction: Transaction) => {
  try {
    await Promise.all(
      transaction.internalTransactions
        .filter(
          (internalTransaction) =>
            internalTransaction.type === 'inbound' &&
            internalTransaction.status !== 'success',
        )
        .map(async (internalTransaction) => {
          const publicClient = createPublicClient({
            chain: getChainByShortName(internalTransaction.chainShortName),
            transport: getTrasportForChainShortName(
              internalTransaction.chainShortName,
            ),
          });
          const receipt = await publicClient.getTransactionReceipt({
            hash: internalTransaction.hash!,
          });
          internalTransaction.status = receipt.status;
        }),
    );
    if (
      transaction.internalTransactions
        .filter((internalTransaction) => internalTransaction.type === 'inbound')
        .every(
          (internalTransaction) => internalTransaction.status === 'success',
        )
    ) {
      transaction.status = 'inbound_success';
    } else if (
      transaction.internalTransactions
        .filter((internalTransaction) => internalTransaction.type === 'inbound')
        .some(
          (internalTransaction) =>
            internalTransaction.type === 'inbound' &&
            internalTransaction.status === 'reverted',
        )
    ) {
      transaction.status = 'inbound_revert';
    }
    updateTransaction(transaction);
  } catch (e) {
    console.log('The Transaction may not be processed on a block yet.');
  }
};

const inboundSuccessHandler = async (transaction: Transaction) => {
  await Promise.all(
    transaction.internalTransactions
      .filter(
        (internalTransaction) =>
          internalTransaction.type === 'outbound' &&
          internalTransaction.status !== 'success',
      )
      .map(async (internalTransaction) => {
        const hash = await transferTo({
          targetAddress: internalTransaction.address,
          targetChainShortName: internalTransaction.chainShortName,
          symbol: internalTransaction.symbol,
          amount: internalTransaction.amount,
        });
        internalTransaction.hash = hash;
        internalTransaction.status = 'pending';
      }),
  );
  transaction.status = 'outbound_pending';
  updateTransaction(transaction);
};

const inboundRevertHandler = async (transaction: Transaction) => {
  await Promise.all(
    transaction.internalTransactions
      .filter(
        (internalTransaction) =>
          (internalTransaction.type === 'inbound' &&
            internalTransaction.status === 'success') ||
          (internalTransaction.type === 'inbound_reverted' &&
            internalTransaction.status === 'reverted'),
      )
      .map(async (internalTransaction) => {
        const hash = await transferTo({
          targetAddress: internalTransaction.address,
          targetChainShortName: internalTransaction.chainShortName,
          symbol: internalTransaction.symbol,
          amount: internalTransaction.amount,
        });
        if (internalTransaction.type === 'inbound') {
          transaction.internalTransactions.push({
            type: 'inbound_reverted',
            address: internalTransaction.address,
            chainShortName: internalTransaction.chainShortName,
            symbol: internalTransaction.symbol,
            amount: internalTransaction.amount,
            fee: internalTransaction.fee,
            status: 'pending',
            hash,
          });
        } else {
          internalTransaction.hash = hash;
          internalTransaction.status = 'pending';
        }
      }),
  );
  transaction.status = 'inbound_revert_pending';
  updateTransaction(transaction);
};

const inboundRevertPendingHandler = async (transaction: Transaction) => {
  try {
    await Promise.all(
      transaction.internalTransactions
        .filter(
          (internalTransaction) =>
            internalTransaction.type === 'inbound_reverted',
        )
        .map(async (internalTransaction) => {
          const publicClient = createPublicClient({
            chain: getChainByShortName(internalTransaction.chainShortName),
            transport: getTrasportForChainShortName(
              internalTransaction.chainShortName,
            ),
          });
          const receipt = await publicClient.getTransactionReceipt({
            hash: internalTransaction.hash!,
          });
          internalTransaction.status = receipt.status;
        }),
    );
    if (
      transaction.internalTransactions
        .filter(
          (internalTransaction) =>
            internalTransaction.type === 'inbound_reverted',
        )
        .every(
          (internalTransaction) => internalTransaction.status === 'success',
        )
    ) {
      transaction.status = 'inbound_reverted_success';
    } else if (
      transaction.internalTransactions
        .filter(
          (internalTransaction) =>
            internalTransaction.type === 'inbound_reverted',
        )
        .some(
          (internalTransaction) => internalTransaction.status === 'reverted',
        )
    ) {
      transaction.status = 'inbound_revert';
    }
    updateTransaction(transaction);
  } catch (e) {
    console.log('The Transaction may not be processed on a block yet.');
  }
};

const outboundPendingHandler = async (transaction: Transaction) => {
  try {
    await Promise.all(
      transaction.internalTransactions
        .filter(
          (internalTransaction) => internalTransaction.type === 'outbound',
        )
        .map(async (internalTransaction) => {
          const publicClient = createPublicClient({
            chain: getChainByShortName(internalTransaction.chainShortName),
            transport: getTrasportForChainShortName(
              internalTransaction.chainShortName,
            ),
          });
          const receipt = await publicClient.getTransactionReceipt({
            hash: internalTransaction.hash!,
          });
          internalTransaction.status = receipt.status;
        }),
    );
    if (
      transaction.internalTransactions
        .filter(
          (internalTransaction) => internalTransaction.type === 'outbound',
        )
        .every(
          (internalTransaction) => internalTransaction.status === 'success',
        )
    ) {
      transaction.status = 'success';
    } else if (
      transaction.internalTransactions
        .filter(
          (internalTransaction) => internalTransaction.type === 'outbound',
        )
        .some(
          (internalTransaction) => internalTransaction.status === 'reverted',
        )
    ) {
      transaction.status = 'outbound_pending';
    }
    updateTransaction(transaction);
  } catch (e) {
    console.log('The Transaction may not be processed on a block yet.');
  }
};

export const run = async () => {
  console.log('Running transaction processor...');
  setInterval(async () => {
    console.log('Processing transactions...');
    await Promise.all(
      getTransactions().map(async (transaction) => {
        if (
          transaction.status !== 'success' &&
          transaction.status !== 'inbound_reverted_success'
        ) {
          console.log(`Processing transaction: ${transaction.id}`);
        }
        switch (transaction.status) {
          case 'recorded':
            await recordedHandler(transaction);
            break;
          case 'inbound_pending':
            await inboundPendingHandler(transaction);
            break;
          case 'inbound_success':
            await inboundSuccessHandler(transaction);
            break;
          case 'inbound_revert':
            await inboundRevertHandler(transaction);
            break;
          case 'inbound_revert_pending':
            await inboundRevertPendingHandler(transaction);
            break;
          case 'outbound_pending':
            await outboundPendingHandler(transaction);
            break;
          default:
            break;
        }
      }),
    );
    console.log('Transactions processed.');
  }, 30000);
};
