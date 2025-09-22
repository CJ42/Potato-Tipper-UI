import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useAccount, useChains } from 'wagmi';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';

import { LSP3ProfileMetadata } from "@lukso/lsp3-contracts"
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import { SUPPORTED_NETWORKS } from '@/constants';
import { isUniversalProfile } from '@/utils';


interface ProfileContextType {
  profile: LSP3ProfileMetadata | null;
  setProfile: React.Dispatch<React.SetStateAction<LSP3ProfileMetadata | null>>;
}

// Set up empty React context initially
const ProfileContext = createContext<ProfileContextType>(
  {
    profile: null,
    setProfile: () => { },
  }
);

/** 
 * Custom hook to use the Profile context and fetch profile data easily across the application and different pages.
 *
 * @returns {ProfileContextType} - The profile state containing all properties.
 */
export function useProfile() {
  return useContext(ProfileContext);
}

/**
 * Provider component for the Profile context, handling property checks and
 * maintaining its state during account and chain changes.
 *
 * @param children - Child components using the Profile context.
 */
export function ProfileProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const account = useAccount()
  const chains = useChains()
  const [profile, setProfile] = useState<LSP3ProfileMetadata | null>(null);

  console.log('%c ProfileProvider account:', 'color: #FE005B', account);
  console.log('%c ProfileProvider chains:', 'color: #FE005B', chains);
  console.log('%c ProfileProvider profile:', 'color: #FE005B', profile);

  // Load profile from local storage on initial render
  useEffect(() => {
    const loadProfileFromLocalStorage = () => {
      const storedProfileData = localStorage.getItem('profileData');
      return storedProfileData ? JSON.parse(storedProfileData) : null;
    };

    const storedProfile = loadProfileFromLocalStorage();
    console.log('ProfileProvider storedProfile', storedProfile);
    if (storedProfile && storedProfile.account === account) {
      setProfile(storedProfile.data);
    } else {
      setProfile(null); // Reset profile if connected account has changed
    }
  }, [account]);

  // Save profile to local storage whenever it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem(
        'profileData',
        JSON.stringify({ account: account.address, data: profile })
      );
    }
  }, [profile, account]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!account.address || !chains) {
        setProfile(null);
        return;
      }

      // Check if the current network used is supported
      const currentNetwork = SUPPORTED_NETWORKS.find(
        (net) => net.chainId === chains[0].id
      );

      if (!currentNetwork) {
        setProfile(null);
        return;
      }

      if (!(await isUniversalProfile(account.address))) {
        setProfile(null);
        return;
      }

      // Fetch the UniversalProfile infos from the blockchain
      const erc725js = new ERC725(
        lsp3ProfileSchema as ERC725JSONSchema[],
        account.address,
        currentNetwork.rpcUrl,
        { ipfsGateway: currentNetwork.ipfsGateway }
      );

      // TODO: move this function in utils.ts
      try {

        const profileMetaData = await erc725js.fetchData('LSP3Profile');
        console.log('%c ProfileProvider profileMetaData: ', 'color: #FE005B', profileMetaData);

        if (
          profileMetaData.value &&
          typeof profileMetaData.value === 'object' &&
          'LSP3Profile' in profileMetaData.value
        ) {
          // Update the profile infos in local storage
          setProfile(profileMetaData.value.LSP3Profile);
        }
      } catch (error) {
        console.error('ProfileProvider: could not fetch profile data: ', error);
      }
    };

    fetchProfileData();
  }, [account, chains]);

  /*
   * Accessible context properties that only update on changes
   */
  const contextProperties = useMemo(
    () => ({
      profile,
      setProfile,
    }),
    [profile, setProfile]
  );

  return (
    <ProfileContext.Provider value={contextProperties}>
      {children}
    </ProfileContext.Provider>
  );
}
