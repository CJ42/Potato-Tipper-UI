import Image from 'next/image';

import { useProfile } from '@/contexts/ProfileContext';

import identicon from 'ethereum-blockies-base64';
import { useAccount } from 'wagmi';

// TODO: this code is old and deprecated. It needs to be fully refactored according to Wagmi documentation

/**
 * Provides a button to connect and disconnect web3 wallet / UP Browser extension from the dApp
 */
const ConnectButton: React.FC = () => {
  const account = useAccount()
  const { profile } = useProfile();

  const identiconUrl = account ? identicon(account.address as string) : '';

  return (
    <div className="flex justify-between items-center">
      <div
        style={{ textAlign: 'center' }}
        className={`w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative border-4 border-white`}
      >
        {!profile?.profileImage || profile.profileImage.length === 0 ? (
          <div className="h-full bg-gray-300 rounded-full"></div> // Show grey background if there is no image
        ) : (
          <Image
            src={profile.profileImage[0].url.replace(
              'ipfs://',
              'https://api.universalprofile.cloud/ipfs/'
            )}
            alt="Profile"
            className="rounded-full"
            fill
            sizes="(max-width: 768px) 100vw"
            priority={true}
            style={{
              objectFit: 'cover',
            }}
          /> // Profile Image
        )}
      </div>
      <code className="mx-2">
        {(account && (
          // (profile?.name || account))
          <>
            <span className="font-bold mr-3 text-[#925648]">{`@${profile?.name}`}</span>
            <code className="text-sm">{`${(account.address as string).slice(0, 7)}...${(account.address as string).slice(-5)}`}</code>
          </>
        )) ||
          'No account connected'}
      </code>
      <div style={{ zIndex: 999999999 }}>
        <button
          className="m-2 bg-green-garden text-white font-bold py-2 px-4 rounded"
          // TODO: implement connect / disconnect functionality
          onClick={(): void => { }}
        >
          {account ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default ConnectButton;
