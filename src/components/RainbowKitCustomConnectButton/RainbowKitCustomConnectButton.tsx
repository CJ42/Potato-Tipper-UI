import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProfile } from '@/contexts/ProfileContext';
import identicon from 'ethereum-blockies-base64';
import { SUPPORTED_NETWORKS } from '@/constants';


const RainbowKitCustomConnectButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const { profile } = useProfile();

                const ready = mounted;
                const connected = ready && account && chain

                const profileImageURL = (connected && profile == null)
                    ? identicon(account.address as string)
                    : profile?.profileImage?.[0]?.url?.replace('ipfs://', SUPPORTED_NETWORKS[0].ipfsGateway + "/");

                const displayName = (connected && profile == null)
                    ? account.displayName
                    : profile?.name;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button" className="m-2 bg-green-garden text-white font-bold py-2 px-4 rounded">
                                        Connect
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button" className="m-2 bg-red-error text-white font-bold py-2 px-4 rounded">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button onClick={openAccountModal} type="button" className="rounded">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 shadow-md">
                                            <img
                                                src={profileImageURL}
                                                alt="User avatar"
                                                width={28}
                                                height={28}
                                                style={{ borderRadius: '999px' }}
                                            />
                                            <span className="text-sm font-medium text-gray-800">{displayName}</span>
                                        </div>
                                        {/* TODO: display POTATO balance here 😁 */}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};





export default RainbowKitCustomConnectButton;