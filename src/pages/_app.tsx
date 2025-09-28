import React from 'react';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  DisclaimerComponent,
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

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <div>
    <Text>
      <div className="mb-2">
        The smart contract you are connecting to hasn’t been formally audited,
        but reviewed with security tools to reduce the risk of bugs and security
        vulnerabilities.
      </div>
      <div className="mb-2">
        By connecting, you acknowledge to use this experimental meme-inspired
        dApp at your own risk.
      </div>
    </Text>
    <Text>
      <Link href="https://github.com/CJ42/potato-tipper-contract">
        See GitHub for security details.
      </Link>
    </Text>
  </div>
);

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
              disclaimer: Disclaimer,
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
