import CardWithContent from '@/components/CardWithContent/CardWithContent';
import ProfilePreview from '@/components/ProfilePreview';
import Image from 'next/image';
// import PotatoTipperNotSetImage from '@/public/images/potato-tipper-not-set.webp';
// import PotatoTipperNotSetImage from '../../public/images/potato-tipper-not-set.webp';
import { lsp7DigitalAssetAbi } from '@lukso/lsp7-contracts/abi';

import { useReadContract, useWriteContract } from 'wagmi';

import { useEthereum } from '@/contexts/EthereumContext';
import { abi as profileABI } from '@lukso/universalprofile-contracts/artifacts/UniversalProfile.json';

import styles from './index.module.css';
import { useRef } from 'react';
import { ethers, parseUnits } from 'ethers';
import { useAccount } from 'wagmi';
import {
  encodeDataKeysValuesForLSP1Delegate,
  encodeDataKeysValuesForTipAmount,
  POTATO_TIPPER_ADDRESS,
  POTATO_TIPPER_AUTHORIZE_AMOUNT_DEFAULT,
  POTATO_TOKEN_ADDRESS,
} from '@/utils/utils';

/**
 * Displays the contents of the landing page within the app.
 */
export default function Home() {
  // TODO: remove and deprecate
  const { connect, disconnect, account } = useEthereum();

  const { writeContract } = useWriteContract();

  // -----

  const { address } = useAccount();
  // const result = useReadContract({
  //   abi: profileABI,
  //   address: address,
  //   functionName: 'getData',
  //   args: [key],
  // });

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

  return (
    <main className="flex flex-col items-center justify-between px-16 pb-4">
      <div className="my-2 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Banner section for announcement of the announcement of the announcement */}
      </div>

      <div className="rounded-lg border border-red-100 p-5 bg-blossom-white">
        <div className="grid text-center align-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
          <Image
            src="/potato-tipper-chilling.webp"
            width="500"
            height="500"
            alt="Potato Tipper connected"
          />
          <CardWithContent />
        </div>
      </div>
      <div className="rounded-lg border border-red-100 p-5 bg-blossom-white mt-4">
        <h2 className="text-2xl m-5">Setup the POTATO Tipper</h2>
        <div className="mb-32 grid text-left lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <Box
            emoji="1️⃣"
            title="Update your UP permissions"
            text="This is required so that you can connect the POTATO Tipper to your Universal Profile"
            onClick={() => {}}
          />
          <div className="opacity-50">
            <ul>
              <li>1. Open your UP Browser Extension</li>
              <li>2. Click on the controllers tab</li>
              <li>3. click on the UP Browser Extension</li>
              <li>
                4. Scroll down and toggle on "Add notifications & automation"
              </li>
              <li>5. Click on "Save Changes"</li>
            </ul>
          </div>
        </div>
        <div className="mb-32 grid text-left lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <Box
            emoji="2️⃣"
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
          <Box
            emoji="🍠"
            title="Happy Tipping!"
            text="You are all set! Feel to configure your tipper, topup overtime and incentivize people to follow you to receive $POTATO tokens 🫡."
            onClick={generateConfetti}
          />
          <div ref={confettiContainerRef} className="confetti-container"></div>
        </div>
      </div>

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
