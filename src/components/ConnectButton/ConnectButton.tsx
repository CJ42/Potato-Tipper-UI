import Image from 'next/image';

import { useEthereum } from '@/contexts/EthereumContext';
import { useProfile } from '@/contexts/ProfileContext';
import styles from './ProfilePreview.module.css';

import identicon from 'ethereum-blockies-base64';

/**
 * Provides a button for connecting to and disconnecting from an
 * Ethereum-based blockchain. It leverages the useEthereum hook
 * from the EthereumContext for managing blockchain connections.
 */

const ConnectButton: React.FC = () => {
  const { connect, disconnect, account } = useEthereum();
  const { profile } = useProfile();

  const identiconUrl = account ? identicon(account) : '';

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
      <code className="mx-2">{account ? account : 'No account connected'}</code>
      <div style={{ zIndex: 999999999 }}>
        <button
          className="m-2 bg-lukso-pink text-white font-bold py-2 px-4 rounded"
          onClick={account ? disconnect : connect}
        >
          {account ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default ConnectButton;
