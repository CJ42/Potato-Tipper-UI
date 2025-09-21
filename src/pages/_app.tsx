import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, WagmiProvider } from 'wagmi';
import { lukso } from 'wagmi/chains';
import {
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import RootLayout from '@/app/layout';
// import { EthereumProvider } from '@/contexts/EthereumContext';
// import { NetworkProvider } from '@/contexts/NetworkContext';
import { ProfileProvider } from '@/contexts/ProfileContext';

import NavBar from '@/components/NavBar';
import { SUPPORTED_NETWORKS } from '@/consts/constants';

import '@/app/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const rainbowConfig = getDefaultConfig({
  appName: 'Potato Tipper',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [lukso],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [lukso.id]: http(SUPPORTED_NETWORKS[0].rpcUrl),
  },
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
        <RainbowKitProvider
          appInfo={{
            appName: 'Rainbowkit Demo',
            learnMoreUrl: 'https://learnaboutcryptowallets.example',
          }}
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#4a7c59',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          showRecentTransactions={true}
          coolMode
        >
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
