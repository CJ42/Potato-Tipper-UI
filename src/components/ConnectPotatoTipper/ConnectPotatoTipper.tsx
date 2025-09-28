import React, { useEffect } from 'react';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { getLSP1DelegataDataKeyValues } from '@/utils';
import { universalProfileAbi } from '@lukso/lsp-smart-contracts/abi';
import { POTATO_TIPPER_ADDRESS, SUPPORTED_NETWORKS } from '@/constants';
import Box from '../Box';
import Button from '../Button';

const ConnectPotatoTipper: React.FC = () => {
  const { address } = useAccount();

  const { lsp1DelegateDataKey, lsp1DelegateDataValue } =
    getLSP1DelegataDataKeyValues();

  const {
    data: connectedLSP1Delegate,
    refetch,
    isFetching,
    isSuccess: isConnectedLSP1DelegateLoaded,
  } = useReadContract({
    abi: universalProfileAbi,
    address: address,
    functionName: 'getData',
    args: [lsp1DelegateDataKey],
  });

  const { data: connectPotatoTipperTxHash, writeContract } = useWriteContract();

  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
    hash: connectPotatoTipperTxHash,
  });

  useEffect(() => {
    if (txConfirmed) refetch();
  }, [txConfirmed, refetch]);

  function connectPotatoTipper() {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    writeContract({
      abi: universalProfileAbi,
      address,
      functionName: 'setData',
      args: [lsp1DelegateDataKey, lsp1DelegateDataValue],
    });
  }

  function disconnectPotatoTipper() {
    if (!address) {
      console.error('No wallet address found. Please connect your wallet.');
      return;
    }

    writeContract({
      abi: universalProfileAbi,
      address,
      functionName: 'setData',
      args: [lsp1DelegateDataKey, '0x'],
    });
  }

  return (
    <div>
      <Box
        // TODO: move this to other component `ConnectPotatoTipper`, with `<Box />` component above
        emoji={connectedLSP1Delegate === POTATO_TIPPER_ADDRESS ? '✅' : '2️⃣'}
        // emoji="2️⃣"
        title="Connect the POTATO Tipper"
        text="Connect the POTATO Tipper contract to your Universal Profile. It will react when you receive new followers 📢."
        // onClick={connectPotatoTipper}
      />
      <div className="mx-5">
        <label className="block mb-2 text-sm text-gray-900">
          Connected address:
        </label>
        {address && isConnectedLSP1DelegateLoaded && (
          <p>
            <a
              href={`${SUPPORTED_NETWORKS[0].explorer}/address/${connectedLSP1Delegate}`}
              target="_blank"
            >
              <code>{connectedLSP1Delegate}</code>
            </a>
          </p>
        )}
        {address && isFetching && <p>Loading...'</p>}
        <p>
          {' '}
          {connectedLSP1Delegate === POTATO_TIPPER_ADDRESS
            ? '✅ POTATO Tipper connected to 🆙'
            : '❌ POTATO Tipper not connected to 🆙'}
        </p>
        <Button
          text="🔌☑️ Connect POTATO Tipper"
          onClick={connectPotatoTipper}
          bgClass="bg-green-garden"
        />
        <Button
          text="🔌❌ Disconnect POTATO Tipper"
          onClick={disconnectPotatoTipper}
          bgClass="bg-red-error"
        />
      </div>
    </div>
  );
};

export default ConnectPotatoTipper;
