import { createConfig, http } from 'wagmi';
import { lukso } from 'wagmi/chains';

export const config = createConfig({
  chains: [lukso],
  transports: {
    [lukso.id]: http(),
  },
});
