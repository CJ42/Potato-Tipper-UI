import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/app/globals.css';
import RootLayout from '@/app/layout';
import { EthereumProvider } from '@/contexts/EthereumContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import NavBar from '@/components/NavBar';

import { WagmiProvider } from 'wagmi';
import { config } from '../../config';

const queryClient = new QueryClient();

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { lukso } from 'wagmi/chains';

const rainbowConfig = getDefaultConfig({
  appName: 'Potato Tipper',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [lukso],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

/**
 * The root component of this application. It wraps all pages
 * with the context providers and a consistent layout.
 *
 * @param { Component, pageProps } - Current page and its properties.
 */
function LUKSOdAppBoilerplate({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        {/* <EthereumProvider> */}
        {/* <NetworkProvider> */}
        <RainbowKitProvider>
          <ProfileProvider>
            <RootLayout>
              <NavBar />
              <Component {...pageProps} />
            </RootLayout>
          </ProfileProvider>
        </RainbowKitProvider>
        {/* </NetworkProvider> */}
        {/* </EthereumProvider> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default LUKSOdAppBoilerplate;
