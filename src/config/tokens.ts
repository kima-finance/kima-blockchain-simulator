/** @format */

import { http } from 'viem';

export const TOKEN_ADDRESSES: {
  [key: string]: {
    [key: string]: { address: `0x${string}`; decimals: number };
  };
} = {
  sep: {
    USDK: {
      address: '0x5FF59Bf2277A1e6bA9bB8A38Ea3F9ABfd3d9345a',
      decimals: 18,
    },
    LINK: {
      address: '0x78dcC5aDB0CC63bf3E3Bf25e6331649F4711D372',
      decimals: 18,
    },
  },
  'arb-sep': {
    LINK: {
      address: '0x78dcC5aDB0CC63bf3E3Bf25e6331649F4711D372',
      decimals: 18,
    },
  },
  holesky: {
    LINK: {
      address: '0x78dcC5aDB0CC63bf3E3Bf25e6331649F4711D372',
      decimals: 18,
    },
  },
  polygonamoy: {
    USDC: {
      address: '0x78dcC5aDB0CC63bf3E3Bf25e6331649F4711D372',
      decimals: 6,
    },
  },
};

export const getTrasportForChainShortName = (chainShortName: string) => {
  switch (chainShortName) {
    case 'sep':
      return http(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      );
    case 'polygonamoy':
      return http(
        `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      );
    case 'arb-sep':
      return http(
        `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      );
    case 'holesky':
      return http(
        `https://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      );
    default:
      return http();
  }
};
