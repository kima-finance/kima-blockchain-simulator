/** @format */

import { createPublicClient, http } from 'viem';
import { transferFrom, transferTo } from '../transactions/transfer';
import { transactionRegistry } from '../storage';
import { getChainByShortName } from '../chains';

export const run = async () => {
  console.log('Running transaction processor...');
  const transport = http();
  setInterval(() => {
    transactionRegistry.map(async (transaction) => {
      console.log(`Processing transaction: ${transaction.id}`);

      switch (transaction.status) {
        case 'recorded':
          const inboundHash = await transferFrom({
            originAddress: transaction.internalTransactions.origin.address,
            originChainShortName:
              transaction.internalTransactions.origin.chainShortName,
            symbol: transaction.internalTransactions.origin.symbol,
            amount: transaction.internalTransactions.origin.amount,
            fee: transaction.internalTransactions.origin.fee,
          });
          transaction.internalTransactions.origin.hash = inboundHash;
          transaction.internalTransactions.origin.status = 'pending';
          transaction.status = 'origin_pending';
          break;
        case 'origin_pending':
          const originPublicClient = createPublicClient({
            chain: getChainByShortName(
              transaction.internalTransactions.origin.chainShortName,
            ),
            transport,
          });
          const originReceipt = await originPublicClient.getTransactionReceipt({
            hash: transaction.internalTransactions.origin.hash!,
          });
          if (originReceipt.status === 'success') {
            transaction.internalTransactions.origin.status = 'success';
            transaction.status = 'origin_success';
          }
          break;
        case 'origin_success':
          const outboundHash = await transferTo({
            targetAddress: transaction.internalTransactions.target.address,
            targetChainShortName:
              transaction.internalTransactions.target.chainShortName,
            symbol: transaction.internalTransactions.target.symbol,
            amount: transaction.internalTransactions.target.amount,
          });
          transaction.internalTransactions.target.hash = outboundHash;
          transaction.internalTransactions.target.status = 'pending';
          transaction.status = 'target_pending';
          break;
        case 'target_pending':
          const targetPublicClient = createPublicClient({
            chain: getChainByShortName(
              transaction.internalTransactions.target.chainShortName,
            ),
            transport,
          });
          const targetReceipt = await targetPublicClient.getTransactionReceipt({
            hash: transaction.internalTransactions.target.hash!,
          });
          if (targetReceipt.status === 'success') {
            transaction.internalTransactions.target.status = 'success';
            transaction.status = 'success';
          }
          break;
        default:
          break;
      }
    });
  }, 20000);
};
