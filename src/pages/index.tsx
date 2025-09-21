import CardWithContent from '@/components/CardWithContent/CardWithContent';
import ProfilePreview from '@/components/ProfilePreview';
import Image from 'next/image';
// import PotatoTipperNotSetImage from '@/public/images/potato-tipper-not-set.webp';
// import PotatoTipperNotSetImage from '../../public/images/potato-tipper-not-set.webp';
import { lsp7DigitalAssetAbi } from '@lukso/lsp7-contracts/abi';

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

import { abi as profileABI } from '@lukso/universalprofile-contracts/artifacts/UniversalProfile.json';

import styles from './index.module.css';
import { useEffect, useRef, useState } from 'react';
import { ethers, parseUnits } from 'ethers';
import { useAccount } from 'wagmi';
import {
  encodeDataKeysValuesForLSP1Delegate,
  encodeDataKeysValuesForTipAmount,
  POTATO_TIPPER_ADDRESS,
  POTATO_TIPPER_AUTHORIZE_AMOUNT_DEFAULT,
  POTATO_TOKEN_ADDRESS,
} from '@/utils';
import Modal from '@/components/Modal';

/**
 * Displays the contents of the landing page within the app.
 */
export default function Home() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  // Debug transaction states
  useEffect(() => {
    console.log(
      'Transaction states - hash:',
      hash,
      'isPending:',
      isPending,
      'error:',
      error
    );
  }, [hash, isPending, error]);

  // Modal state
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isPotatoTipperConnected, setIsPotatoTipperConnected] = useState(false);

  // -----

  const { address } = useAccount();

  // Check if POTATO Tipper is connected
  const { key: lsp1DelegateKey } = encodeDataKeysValuesForLSP1Delegate();
  const potatoTipperData = useReadContract({
    abi: profileABI,
    address: address,
    functionName: 'getData',
    args: [lsp1DelegateKey],
    query: {
      enabled: !!address, // Only run when address is available
    },
  });

  // Wait for transaction receipt to refetch data
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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

  // Step 1: Connect Potato Tipper
  // TODO: debug transaction reverting
  const connectPotatoTipper = () => {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    const { key, value } = encodeDataKeysValuesForLSP1Delegate();

    writeContract({
      abi: profileABI,
      address,
      functionName: 'setData',
      args: [key, value],
    });
  };

  // Step 2: Setup tip amount
  // TODO: add input field
  const setupTipAmount = () => {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    const { key, value } = encodeDataKeysValuesForTipAmount();

    writeContract({
      abi: profileABI,
      address,
      functionName: 'setData',
      // Example: tip 42 $POTATOs
      args: [key, value],
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

  // TODO: move to separate component file
  type BoxProps = {
    emoji: string;
    title: string;
    text: string;
    onClick: () => void;
  };

  const Box = ({ emoji, title, text, onClick }: BoxProps) => (
    <button
      onClick={onClick}
      className="group rounded-lg border border-transparent px-5 py-4 hover:border-slate-200 hover:bg-white text-left"
      rel="noopener noreferrer"
    >
      <h2 className={`mb-3 text-2xl font-semibold`}>
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none mr-2">
          {emoji}
        </span>
        {title}
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{text}</p>
    </button>
  );

  // HoverVideo component
  // TODO: move to separate component file
  const HoverVideo = ({
    imageSrc,
    videoSrc,
    alt,
    width,
    height,
  }: {
    imageSrc: string;
    videoSrc: string;
    alt: string;
    width: string;
    height: string;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
    };

    return (
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }}
        onClick={handlePlay}
      >
        {/* Image */}
        <Image
          src={imageSrc}
          width={parseInt(width)}
          height={parseInt(height)}
          alt={alt}
          className={`transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Video Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            width={parseInt(width)}
            height={parseInt(height)}
            className="w-full h-full object-cover rounded-lg"
            onEnded={handleVideoEnd}
            preload="metadata"
          />

          {/* Play/Pause Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all duration-200">
              {isPlaying ? (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
            <input
              type="number"
              id="number-input"
              aria-describedby="helper-text-explanation"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-green-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="90210"
              required
            />
          </div>
          <div className="mx-5">
            <label className="block mb-2 text-sm text-gray-900">
              Tip amount:
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
