/** @format */

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
  polygonamoy: {
    USDC: {
      address: '0x78dcC5aDB0CC63bf3E3Bf25e6331649F4711D372',
      decimals: 6,
    },
  },
};
