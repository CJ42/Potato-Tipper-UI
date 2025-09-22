import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  RainbowKitProvider,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { config } from '../../wagmi.config';

import RootLayout from '@/app/layout';
import NavBar from '@/components/NavBar';
import UniversalProfileRainbowKitAvatar from '@/components/UniversalProfileRainbowKitAvatar';

import '@/app/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

/**
 * The root component of this application. It wraps all pages
 * with the context providers and a consistent layout.
 *
 * @param { Component, pageProps } - Current page and its properties.
 */
function LUKSOdAppBoilerplate({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <RainbowKitProvider
            avatar={UniversalProfileRainbowKitAvatar}
            appInfo={{
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
            <RootLayout>
              <NavBar />
              <Component {...pageProps} />
            </RootLayout>
          </RainbowKitProvider>
        </ProfileProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default LUKSOdAppBoilerplate;
