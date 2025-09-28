import { encodeDataKeysValuesForTipAmount } from '@/utils';
import { universalProfileAbi } from '@lukso/lsp-smart-contracts/abi';
import React, { useEffect, useState } from 'react';

import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import Box from '../Box';
import Button from '../Button/Button';
import { formatUnits, fromHex, hexToBigInt, parseUnits, toHex } from 'viem';

const SetupTipAmount: React.FC = () => {
  const { address } = useAccount();

  const [configuredTipAmount, setConfiguredTipAmount] = useState<bigint | null>(
    null
  );

  // TODO: let erc725.js encode the value from bigint to uint256 hex
  // and let React state deal with numbers.
  const { tipAmountDataKey } = encodeDataKeysValuesForTipAmount();

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
    if (configuredTipAmount === null) {
      console.error('Please enter a valid tip amount.');
      return;
    }

    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    writeContract({
      abi: universalProfileAbi,
      address,
      functionName: 'setData',
      args: [tipAmountDataKey, toHex(configuredTipAmount)],
    });
  }

  return (
    <div>
      <Box
        emoji={
          currentTipAmount && hexToBigInt(currentTipAmount) > 0 ? '✅' : '3️⃣'
        }
        title="Setup the tip amount"
        text="Choose how many 🥔 tokens you want to tip your new followers. This amount is saved in your Universal Profile."
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
          className="bg-[#4a7c59] space-x-2 px-4 py-2 shadow-md border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="90210"
          required
          onChange={(e) => {
            const value = e.target.value;
            const valueInWei = parseUnits(value, 18);
            console.log('valueInWei', valueInWei);
            setConfiguredTipAmount(valueInWei);
          }}
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
