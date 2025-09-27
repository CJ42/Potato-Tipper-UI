import { useEffect, useRef, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useAccountModal } from '@rainbow-me/rainbowkit';

// import PotatoTipperNotSetImage from '@/public/images/potato-tipper-not-set.webp';
// import PotatoTipperNotSetImage from '../../public/images/potato-tipper-not-set.webp';
import { lsp7DigitalAssetAbi } from '@lukso/lsp7-contracts/abi';
import { universalProfileAbi } from '@lukso/universalprofile-contracts/abi';

import CardWithContent from '@/components/CardWithContent/CardWithContent';
import Modal from '@/components/Modal';
import Box from '@/components/Box';

import {
  getLSP1DelegataDataKeyValues,
  encodeDataKeysValuesForTipAmount,
} from '@/utils';
import {
  INSTALL_UP_EXTENSION_URL,
  POTATO_TIPPER_ADDRESS,
  POTATO_TIPPER_AUTHORIZE_AMOUNT_DEFAULT,
  POTATO_TOKEN_ADDRESS,
  SUPPORTED_NETWORKS,
} from '@/constants';
import HoverVideo from '@/components/HoverVideo';

/**
 * Displays the contents of the landing page within the app.
 */
export default function Home() {
  const { address, connector } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { writeContract } = useWriteContract();

  console.log('%c openAccountModal:', 'color: #FE005B', openAccountModal);
  console.log('%c useAccount connector:', 'color: #FE005B', connector);

  // Modal state
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isEOANotSupportedModalOpen, setIsEOANotSupportedModalOpen] =
    useState(false);
  const [isPotatoTipperConnected, setIsPotatoTipperConnected] = useState(false);

  // ----- Only UP Browser Extension Check -----
  useEffect(() => {
    if (connector && connector.id !== 'cloud.universalprofile') {
      setIsEOANotSupportedModalOpen(true);
    } else {
      setIsEOANotSupportedModalOpen(false);
    }
  }, [connector]);

  // ----- POTATO Tipper Connection Check -----

  // Step 1: Check if POTATO Tipper is connected. If not allow to connect it
  const { lsp1DelegateKey, lsp1DelegateValue } = getLSP1DelegataDataKeyValues();

  // TODO: create as a function isPotatoTipperConnected(address) to reuse it and embed the useReadContract inside maybe?
  const potatoTipperData = useReadContract({
    abi: universalProfileAbi,
    address: address,
    functionName: 'getData',
    args: [lsp1DelegateKey as `0x${string}`],
    query: {
      enabled: !!address, // Only run when address is available
    },
  });

  // Connect Potato Tipper
  // TODO: debug transaction reverting
  const connectPotatoTipper = () => {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    writeContract({
      abi: universalProfileAbi,
      address,
      functionName: 'setData',
      args: [lsp1DelegateKey, lsp1DelegateValue],
    });
  };

  // Update connection status when data changes
  useEffect(() => {
    console.log('=== DATA UPDATE DEBUG ===');
    console.log('Raw data from contract:', potatoTipperData.data);
    console.log('Data type:', typeof potatoTipperData.data);
    console.log(
      'Data length:',
      typeof potatoTipperData.data === 'string'
        ? potatoTipperData.data.length
        : 'N/A'
    );
    console.log('Is data truthy:', !!potatoTipperData.data);
    console.log('Is data not 0x:', potatoTipperData.data !== '0x');
    console.log(
      'Current isPotatoTipperConnected state:',
      isPotatoTipperConnected
    );
    console.log('Expected POTATO_TIPPER_ADDRESS:', POTATO_TIPPER_ADDRESS);

    // More robust check for connection status
    const isConnected =
      potatoTipperData.data &&
      potatoTipperData.data !== '0x' &&
      potatoTipperData.data !==
        '0x0000000000000000000000000000000000000000000000000000000000000000' &&
      typeof potatoTipperData.data === 'string' &&
      potatoTipperData.data.length > 2;

    console.log('Is connected check result:', isConnected);

    if (isConnected) {
      console.log('✅ Setting isPotatoTipperConnected to true');
      setIsPotatoTipperConnected(true);
    } else {
      console.log('❌ Setting isPotatoTipperConnected to false');
      setIsPotatoTipperConnected(false);
    }
    console.log('=== END DATA UPDATE DEBUG ===');
  }, [potatoTipperData.data]);

  // Step 2: Setup tip amount
  const setupTipAmount = () => {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    const { key, value } = encodeDataKeysValuesForTipAmount();

    writeContract({
      abi: universalProfileAbi,
      address,
      functionName: 'setData',
      // Example: tip 42 $POTATOs
      args: [key as `0x${string}`, value as `0x${string}`],
    });
  };

  // Step 3: Authorize POTATO Tipper contract as operator
  const authorizePotatoTipperAsOperator = () => {
    writeContract({
      abi: lsp7DigitalAssetAbi,
      address: POTATO_TOKEN_ADDRESS,
      functionName: 'authorizeOperator',
      args: [
        POTATO_TIPPER_ADDRESS,
        POTATO_TIPPER_AUTHORIZE_AMOUNT_DEFAULT,
        '0x',
      ],
    });
  };

  const confettiContainerRef = useRef<HTMLDivElement | null>(null);
  const generateConfetti = () => {
    const container = confettiContainerRef.current;

    // Check if container is valid
    if (!container) {
      console.error('Confetti container not found.');
      return;
    }

    const colors = [
      '#FF5733',
      '#33FF57',
      '#3357FF',
      '#FFC300',
      '#FF33B5',
      '#33FFF0',
    ];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti-piece');
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = Math.random() * -20 + 'vh'; // Start above the screen
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';

      container.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between px-16 pb-4">
      <div className="my-2 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Banner section for announcement of the announcement of the announcement */}
      </div>

      <div className="rounded-lg border border-red-100 p-5 bg-beige-soil">
        <div className="grid text-center align-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
          <HoverVideo
            imageSrc="/potato-tipper-chilling.webp"
            videoSrc="/potato-character-fun-video.mp4"
            width="500"
            height="500"
            alt="Potato Tipper connected"
          />
          <CardWithContent />
        </div>
      </div>
      <div className="rounded-lg border border-red-100 p-5 bg-beige-soil mt-4">
        <h2 className="text-2xl m-5">Setup the POTATO Tipper</h2>
        <div className="mb-32 grid text-left lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <Box
            emoji="1️⃣"
            title="Update your UP permissions"
            text="This is required so that you can connect the POTATO Tipper to your Universal Profile"
            onClick={() => setIsPermissionsModalOpen(true)}
          />
          <Box
            emoji={isPotatoTipperConnected ? '✅' : '2️⃣'}
            title="Connect the POTATO Tipper"
            text="Connect the POTATO Tipper contract to your Universal Profile. It will react when you receive new followers 📢."
            onClick={connectPotatoTipper}
          />
          <Box
            emoji="3️⃣"
            title="Setup the tip amount"
            text="Choose how many 🥔 tokens you want to tip your new followers. This amount is saved in your Universal Profile's metadata."
            onClick={setupTipAmount}
          />
          <Box
            emoji="4️⃣"
            title="Authorize the Tipper to spend"
            text="Set up to how many tokens the tipper can distribute on your behalf. This amount should be topped up regularly."
            onClick={authorizePotatoTipperAsOperator}
          />
          <div ref={confettiContainerRef} className="confetti-container"></div>
        </div>
        <div className="mb-32 grid text-left lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <div>
            Permissions:{' '}
            {/* TODO: add CHECK if UP Browser Extension Main Controller has enough permissions*/}{' '}
          </div>
          <div className="mx-5">
            {/* TODO: add check if the connected address for the LSP1 Delegate connected to the type ID is set correctly or not */}
            <label className="block mb-2 text-sm text-gray-900">
              Connected address:
            </label>
            <a
              href={`${SUPPORTED_NETWORKS[0].explorer}/address/${POTATO_TIPPER_ADDRESS}`}
              target="_blank"
            >
              <code>{POTATO_TIPPER_ADDRESS}</code>
            </a>
            <p>
              {' '}
              {isPotatoTipperConnected
                ? '✅ POTATO Tipper connected to 🆙'
                : '❌ POTATO Tipper not connected to 🆙'}
            </p>
            {/* TODO: allow to disconnect if connected */}
            <button
              type="button"
              className="m-2 bg-green-garden text-white font-bold py-2 px-4 rounded"
              onClick={connectPotatoTipper}
            >
              Connect POTATO Tipper
            </button>
          </div>
          <div className="mx-5">
            <label className="block mb-2 text-sm text-gray-900">
              Tip amount:
            </label>
            <input
              type="number"
              id="number-input"
              aria-describedby="helper-text-explanation"
              className="bg-gray-100 space-x-2 px-4 py-2 shadow-md border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="90210"
              required
            />
          </div>
          <div className="mx-5">
            <label className="block mb-2 text-sm text-gray-900">
              Allocated amount:
            </label>
            <input
              type="number"
              id="number-input"
              aria-describedby="helper-text-explanation"
              className="bg-[#4a7c59] border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="90210"
              required
            />
          </div>
        </div>
        <div className="mt-10 text-center">
          <Box
            emoji="🍠"
            title="Happy Tipping!"
            text="You are all set! Feel to configure your tipper, topup overtime and incentivize people to follow you to receive $POTATO tokens 🫡."
            onClick={generateConfetti}
          />
        </div>
      </div>

      {/* Modal for UP permissions setup */}
      <Modal
        title="UP Browser Extension Setup"
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            To use the POTATO Tipper, you need to enable specific permissions in
            your Universal Profile Browser Extension. Follow these steps
            carefully:
          </p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Step-by-Step Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Open your Universal Profile Browser Extension</li>
              <li>Click on the "Controllers" tab in the extension</li>
              <li>Click on the "UP Browser Extension" controller</li>
              <li>
                Scroll down to find the "Add notifications & automation" option
              </li>
              <li>Toggle ON the "Add notifications & automation" setting</li>
              <li>
                Click on "Save Changes" + confirm transaction to apply the new
                permissions
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">
              📹 Video Tutorial:
            </h3>
            <div className="relative w-full max-w-2xl mx-auto">
              <video
                controls
                muted
                className="w-full rounded-lg shadow-lg"
                preload="metadata"
              >
                <source src="/add-urd-permissions-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Important Notes:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>
                Switching on this permission allows you to{' '}
                <strong>connect</strong> the POTATO Tipper contract to the
                notification type <strong>"new follower"</strong>, so that your
                🆙 can automatically react when it receives new followers.
              </li>
              <li>
                Without this permission, you cannot connect the POTATO tipper
                contract to your 🆙.
              </li>
              <li>
                <strong>
                  You can switch off this permission after connecting the POTATO
                  Tipper for safety .
                </strong>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              ✅ What happens next:
            </h3>
            <p className="text-green-700">
              Once you've enabled these permissions, you can proceed with
              connecting the POTATO Tipper to your Universal Profile and setting
              up your tipping preferences.
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setIsPermissionsModalOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for EOA wallets not supported */}
      <Modal
        title="EOA Wallet not supported"
        isOpen={isEOANotSupportedModalOpen}
        // Prevent closing the modal. Only closes once extension connected is Universal Profile
        onClose={() => {}}
        closeDisable={true}
        size={0}
      >
        <div className="align-center text-center space-y-4">
          <p className="text-gray-700">
            Oopss... The 🥔 tipper only supports the{' '}
            <a
              href={INSTALL_UP_EXTENSION_URL}
              target="_blank"
              className="text-blue-500 hover:text-blue-700"
            >
              🆙 Browser Extension.
            </a>
          </p>
          <p className="text-gray-700">
            EOA (Externally Owned Account) wallets are not supported.
          </p>
          <div className="my-2">
            {address && openAccountModal && (
              <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl -white bg-green-garden p-6 shadow-lg outline outline-black/5 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                <img
                  className="size-16 shrink-0"
                  src="/potato-sad.webp"
                  alt="..."
                />
                <button onClick={openAccountModal} type="button">
                  <div className="text-left">
                    <div className="text-xl font-medium text-black dark:text-white">
                      Switch Wallet
                    </div>
                    <p className="text-white">
                      Connect with the 🆙 Browser Extension to use the POTATO
                      Tipper and tip new followers!
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className="my-2">
            <a
              className="my-2"
              href="https://my.universalprofile.cloud/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-green-garden p-6 shadow-lg outline outline-black/5 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                <img
                  className="size-16 shrink-0"
                  src="/up_logo.png"
                  alt="..."
                />
                <div className="text-left">
                  <div className="text-xl font-medium text-black dark:text-white">
                    Create a Universal Profile
                  </div>
                  <p className="text-white">
                    Never heard of Universal Profiles? Create one in less than
                    3min and start tipping 🥔 to new followers!
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Modal>

      {/* <div className="rounded-lg border border-red-100 p-5 bg-pink-50 mt-4 text-center">
          This application framework was created using Next for React. Visit the
          <a
            href="https://docs.lukso.tech/learn/dapp-developer/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 mx-1"
          >
            Developer Documentation
          </a>
          or fork its code on
          <a
            href="https://github.com/lukso-network/tools-dapp-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            GitHub
          </a>
          .
        </div> */}
    </main>
  );
}
