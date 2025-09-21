// Contract Signature Verification
// https://eips.ethereum.org/EIPS/eip-1271
export const EIP_1271_MAGIC_VALUE = '0x1626ba7e';

export const SUPPORTED_NETWORKS = [
  {
    name: 'LUKSO Mainnet',
    chainId: 42,
    rpcUrl: 'https://42.rpc.thirdweb.com',
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
    explorer: 'https://explorer.execution.mainnet.lukso.network/',
    token: 'LYX',
  },
];
