import { keccak256, parseUnits, stringToHex, createPublicClient, http } from 'viem';
import { lukso } from 'viem/chains'
import { ERC725 } from '@erc725/erc725.js';

import LSP1Schema from '@erc725/erc725.js/schemas/LSP1UniversalReceiverDelegate.json';
import { LSP26_TYPE_IDS } from '@lukso/lsp26-contracts';
import { INTERFACE_ID_LSP0 } from '@lukso/lsp0-contracts';

// Constants
import { POTATO_TIPPER_ADDRESS, POTATO_TIP_AMOUNT_DEFAULT } from './constants';

const POTATO_TIP_AMOUNT_DATA_KEY_SCHEMA = {
  name: 'POTATO-Tip-Amount',
  key: keccak256(stringToHex('POTATO-Tip-Amount')),
  keyType: 'Singleton',
  valueType: 'uint256',
  valueContent: 'Number',
};

const provider = createPublicClient({
  chain: lukso,
  transport: http(),
})

const erc725js = new ERC725([...LSP1Schema, POTATO_TIP_AMOUNT_DATA_KEY_SCHEMA]);

/// @dev encode data key for LSP1UniversalReceiverDelegate:<new-follower> type ID
export function encodeDataKeysValuesForLSP1Delegate() {
  const {
    keys: [key],
    values: [value],
  } = erc725js.encodeData({
    keyName: 'LSP1UniversalReceiverDelegate:<bytes32>',
    dynamicKeyParts: [LSP26_TYPE_IDS.LSP26FollowerSystem_FollowNotification],
    value: POTATO_TIPPER_ADDRESS,
  });

  return { key, value };
}

/// @dev encode data key / value where we will store the POTATO Tip amount
export function encodeDataKeysValuesForTipAmount() {
  const {
    keys: [key],
    values: [value],
  } = erc725js.encodeData({
    keyName: 'POTATO-Tip-Amount',
    value: POTATO_TIP_AMOUNT_DEFAULT,
  });

  return { key, value };
}


export async function isUniversalProfile(
  address: string
): Promise<boolean> {
  try {
    if (!address) {
      return false;
    }

    const code = await provider.getCode({ address: address as `0x${string}` });

    if (code === undefined) {
      return false;
    }

    const supportsLSP0Interface = await provider.readContract({
      address: address as `0x${string}`,
      abi: [
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      functionName: 'supportsInterface',
      args: [INTERFACE_ID_LSP0],
    })
    console.log('supportsLSP0Interface', supportsLSP0Interface);
    return supportsLSP0Interface;
  } catch (error) {
    console.error('Error checking LSP0 interface ID: ', error);
    return false;
  }
}
