import { encodeDataKeysValuesForTipAmount } from '@/utils';
import { universalProfileAbi } from '@lukso/lsp-smart-contracts/abi';
import React, { useEffect } from 'react';

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import Box from '../Box';
import Button from '../Button/Button';
import { formatUnits, hexToBigInt } from 'viem';

const SetupTipAmount: React.FC = () => {
  const { address } = useAccount();

  const { tipAmountDataKey, tipAmountDataValue } =
    encodeDataKeysValuesForTipAmount();

  const { data: currentTipAmount, refetch } = useReadContract({
    abi: universalProfileAbi,
    address: address,
    functionName: 'getData',
    args: [tipAmountDataKey],
  });

  const { data: setTipAmountTxHash, writeContract } = useWriteContract();

  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
    hash: setTipAmountTxHash,
  });

  useEffect(() => {
    if (txConfirmed) refetch();
  }, [txConfirmed, refetch]);

  function setupTipAmount() {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    writeContract({
      abi: universalProfileAbi,
      address,
      functionName: 'setData',
      // Example: tip 42 $POTATOs
      args: [tipAmountDataKey, tipAmountDataValue],
    });
  }

  return (
    <div>
      <Box
        emoji="3️⃣"
        title="Setup the tip amount"
        text="Choose how many 🥔 tokens you want to tip your new followers. This amount is saved in your Universal Profile's metadata."
        onClick={setupTipAmount}
      />
      <div className="mx-5">
        <div className="mb-2 ">
          <label className="mr-2 text-sm text-gray-900">Current amount:</label>
          <code>
            {currentTipAmount && formatUnits(hexToBigInt(currentTipAmount), 18)}{' '}
            🥔
          </code>
        </div>
        <label className="block mb-2 text-sm text-gray-900">
          Modify tip amount:
        </label>
        <input
          type="number"
          id="number-input"
          aria-describedby="helper-text-explanation"
          className="bg-gray-100 space-x-2 px-4 py-2 shadow-md border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="90210"
          required
        />
        <Button
          text="🥔 Modify Tip Amount"
          onClick={setupTipAmount}
          bgClass="bg-blue-500"
        />
      </div>
    </div>
  );
};

export default SetupTipAmount;
