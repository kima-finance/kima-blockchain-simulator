/** @format */

import { extractChain } from 'viem';
import * as allChains from 'viem/chains';
import { Chain } from 'viem';
import chainsJson from './chains.json';

export const getEVMChainByChainId = (chainId: number): Chain => {
  return extractChain({
    chains: Object.values(allChains),
    // @ts-ignore
    id: chainId,
  });
};

const getChainIdByShortName = (shortName: string): number => {
  const chain = chainsJson.find(
    (chainData) => chainData.shortName === shortName,
  );
  if (!chain) {
    throw new Error(`Chain with shortName ${shortName} not found`);
  }
  return chain.chainId;
};

export const getChainByShortName = (shortName: string): Chain => {
  return getEVMChainByChainId(getChainIdByShortName(shortName));
};
