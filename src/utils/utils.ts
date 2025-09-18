import { keccak256, parseUnits, stringToHex } from 'viem';
import { ERC725 } from '@erc725/erc725.js';
import LSP1Schema from '@erc725/erc725.js/schemas/LSP1UniversalReceiverDelegate.json';
import { LSP26_TYPE_IDS } from '@lukso/lsp26-contracts';

// Constants
export const POTATO_TOKEN_ADDRESS =
  '0x4C3e98829Eeff226526Ae4a492D054AA683eC0CE';
export const POTATO_TIPPER_ADDRESS =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
export const POTATO_TIPPER_AUTHORIZE_AMOUNT_DEFAULT = parseUnits('1000000', 18);
const POTATO_TIP_AMOUNT_DEFAULT = parseUnits('42', 18);

const POTATO_TIP_AMOUNT_DATA_KEY_SCHEMA = {
  name: 'POTATO-Tip-Amount',
  key: keccak256(stringToHex('POTATO-Tip-Amount')),
  keyType: 'Singleton',
  valueType: 'uint256',
  valueContent: 'Number',
};

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
