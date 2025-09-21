import {
    RainbowKitProvider,
    AvatarComponent
} from '@rainbow-me/rainbowkit';

import { useProfile } from '@/contexts/ProfileContext';
import identicon from 'ethereum-blockies-base64';

const UniversalProfileRainbowKitAvatar: AvatarComponent = ({ address, size }) => {
    const { profile } = useProfile();

    // This line assumes that the smallest profile image is stored in the 4th index and is of small size.
    const profilemageIPFSURL = profile?.profileImage?.[4]?.url

    const profileImageURL = profilemageIPFSURL ?
        profilemageIPFSURL.replace('ipfs://', 'https://api.universalprofile.cloud/ipfs/')
        : identicon(address);

    return <img
        src={profileImageURL}
        width={size}
        height={size}
        style={{ borderRadius: 999 }}
    />;
};

export default UniversalProfileRainbowKitAvatar;