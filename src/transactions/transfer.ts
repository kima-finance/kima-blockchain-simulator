/** @format */

import { createPublicClient, createWalletClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { getChainByShortName } from '../chains';
import { TOKEN_ADDRESSES } from '../config/tokens';

type TransferFromParams = {
  originAddress: string;
  originChainShortName: string;
  symbol: string;
  amount: number;
  fee: number;
};

type TransferToParams = {
  targetAddress: string;
  targetChainShortName: string;
  symbol: string;
  amount: number;
};

const contractABI = [
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const transferFrom = async ({
  originAddress,
  originChainShortName,
  symbol,
  amount,
  fee,
}: TransferFromParams) => {
  const originChain = getChainByShortName(originChainShortName);

  const transport = http();
  const originPublicClient = createPublicClient({
    chain: originChain,
    transport,
  });
  const originWalletClient = createWalletClient({
    chain: originChain,
    transport,
  });

  const poolAccount = privateKeyToAccount(
    process.env.POOL_PRIVATE_KEY as `0x${string}`,
  );

  const token = TOKEN_ADDRESSES[originChainShortName][symbol];

  const { request } = await originPublicClient.simulateContract({
    account: poolAccount,
    address: token.address,
    abi: contractABI,
    functionName: 'transferFrom',
    args: [
      originAddress,
      poolAccount.address,
      parseUnits((Number(amount) + Number(fee)).toString(), token.decimals),
    ],
  });
  const hash = await originWalletClient.writeContract(request);
  console.log('tx hash', hash);
  return hash;
};

export const transferTo = async ({
  targetAddress,
  targetChainShortName,
  symbol,
  amount,
}: TransferToParams) => {
  const targetChain = getChainByShortName(targetChainShortName);

  const transport = http();

  const targetPublicClient = createPublicClient({
    chain: targetChain,
    transport,
  });
  const targetWalletClient = createWalletClient({
    chain: targetChain,
    transport,
  });

  const poolAccount = privateKeyToAccount(
    process.env.POOL_PRIVATE_KEY as `0x${string}`,
  );

  const token = TOKEN_ADDRESSES[targetChainShortName][symbol];

  const { request } = await targetPublicClient.simulateContract({
    account: poolAccount,
    address: token.address,
    abi: contractABI,
    functionName: 'transferFrom',
    args: [
      poolAccount.address,
      targetAddress,
      parseUnits(amount.toString(), token.decimals),
    ],
  });
  const hash = await targetWalletClient.writeContract(request);
  console.log('tx hash', hash);

  return hash;
};
