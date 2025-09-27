import { parseUnits } from 'viem';

export const INSTALL_UP_EXTENSION_URL =
  'https://chromewebstore.google.com/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en';

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  ipfsGateway: string;
  explorer: string;
  token: string;
};

export const SUPPORTED_NETWORKS: Network[] = [
  {
    name: 'LUKSO Mainnet',
    chainId: 42,
    rpcUrl: 'https://42.rpc.thirdweb.com',
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
    explorer: 'https://explorer.lukso.network/',
    token: 'LYX',
  },
];

export const POTATO_TOKEN_ADDRESS =
  '0x4C3e98829Eeff226526Ae4a492D054AA683eC0CE';
export const POTATO_TIPPER_ADDRESS =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
export const POTATO_TIPPER_AUTHORIZE_AMOUNT_DEFAULT = parseUnits('1000000', 18);
export const POTATO_TIP_AMOUNT_DEFAULT = parseUnits('42', 18);
