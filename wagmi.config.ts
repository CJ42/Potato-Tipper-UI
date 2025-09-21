import { SUPPORTED_NETWORKS } from '@/consts/constants';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { lukso } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Potato Tipper',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    chains: [lukso],
    ssr: true, // If your dApp uses server side rendering (SSR)
    transports: {
        [lukso.id]: http(SUPPORTED_NETWORKS[0].rpcUrl),
    },
});