import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProfile } from '@/contexts/ProfileContext';
import identicon from 'ethereum-blockies-base64';


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

                let profileImageURL;
                let displayName;

                if (connected && profile == null) {
                    profileImageURL = identicon(account.address as string);
                    console.log('profileImageURL', profileImageURL);
                    displayName = account.displayName;
                } else {
                    profileImageURL = profile?.profileImage?.[0]?.url?.replace('ipfs://', 'https://api.universalprofile.cloud/ipfs/');
                    console.log('profileImageURL', profileImageURL);
                    displayName = profile?.name;

                }

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
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {/* <button
                                        onClick={openChainModal}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        style={{ width: 12, height: 12 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button> */}
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
                                        {/* {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''} */}
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