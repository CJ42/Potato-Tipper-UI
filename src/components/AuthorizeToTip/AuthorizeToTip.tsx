import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { lsp7DigitalAssetAbi } from '@lukso/lsp7-contracts/abi';

import { POTATO_TIPPER_ADDRESS, POTATO_TOKEN_ADDRESS } from '@/constants';
import Box from '../Box';
import { formatUnits, parseUnits } from 'viem';
import Button from '../Button';

const AuthorizeToTip: React.FC = () => {
  const { address } = useAccount();

  const [configuredAuthorizedAmount, setConfiguredAuthorizedAmount] = useState<
    bigint | null
  >(null);

  const { data: authorizedAmount, refetch } = useReadContract({
    abi: lsp7DigitalAssetAbi,
    address: POTATO_TOKEN_ADDRESS,
    functionName: 'authorizedAmountFor',
    args: [POTATO_TIPPER_ADDRESS, address as `0x${string}`],
  });

  const { data: authorizeOperatorTxHash, writeContract } = useWriteContract();

  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
    hash: authorizeOperatorTxHash,
  });

  useEffect(() => {
    if (txConfirmed) refetch();
  }, [txConfirmed, refetch]);

  const authorizePotatoTipperAsOperator = () => {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    if (configuredAuthorizedAmount === null) {
      console.log('No authorized amount configured. Please configure one');
      return;
    }

    writeContract({
      abi: lsp7DigitalAssetAbi,
      address: POTATO_TOKEN_ADDRESS,
      functionName: 'authorizeOperator',
      args: [POTATO_TIPPER_ADDRESS, configuredAuthorizedAmount, '0x'],
    });
  };
  return (
    <div>
      <Box
        emoji={authorizedAmount && authorizedAmount > 0 ? '✅' : '4️⃣'}
        title="Authorize to spend"
        text="Set up to how many tokens the tipper can distribute on your behalf. This amount should be topped up regularly."
      />
      <div className="mx-5">
        <div className="mb-2">
          <label className="mr-2 text-sm text-gray-900">
            Authorized amount:
          </label>
          <code>
            {authorizedAmount !== undefined ? formatUnits(authorizedAmount, 18) : '0'} 🥔
          </code>
        </div>
        <label className="block mb-2 text-sm text-gray-900">
          Modify authorized amount:
        </label>
        <input
          type="number"
          className="bg-[#4a7c59] border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
          onChange={(e) => {
            const value = e.target.value;
            const valueInWei = parseUnits(value, 18);
            console.log('authorized amount in wei: ', valueInWei);
            setConfiguredAuthorizedAmount(valueInWei);
          }}
        />
        <Button
          text="🥔 Authorize Tipping"
          onClick={authorizePotatoTipperAsOperator}
          bgClass="bg-blue-500 hover:bg-blue-700"
        />
      </div>
    </div>
  );
};

export default AuthorizeToTip;
