/**
 * Metadata of the application
 */
export const config = {
  metadata: {
    title: 'POTATO Tipper',
    description: 'dApp to setup tipping $POTATO tokens on new followers',
    url: 'https://boilerplate.lukso.tech/',
    icon: '/lyx_token_symbol.svg',
  },
  extension: {
    name: 'Universal Profiles',
    url: 'https://chrome.google.com/webstore/detail/universal-profiles/abpickdkkbnbcoepogfhkhennhfhehfn?hl=en',
  },
  walletTools: {
    // Exchange this value with your own project ID
    walletConnectProjectID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
};
