module.exports = [
  {
    constant: true,
    inputs: [],
    name: 'FREEZE_GRACE_PERIOD',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' },
      { name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newAdmin', type: 'address' }],
    name: 'registerTokenAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getOrderRoot',
    outputs: [{ name: 'root', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRegisteredAvailabilityVerifiers',
    outputs: [{ name: '_verifers', type: 'address[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'verifier', type: 'address' }],
    name: 'announceAvailabilityVerifierRemovalIntent',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'vaultId', type: 'uint256' }],
    name: 'fullWithdrawalRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'mainAcceptGovernance',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'starkKey', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' }
    ],
    name: 'getFullWithdrawalRequest',
    outputs: [{ name: 'res', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'verifierAddress', type: 'address' }],
    name: 'isVerifier',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isFrozen',
    outputs: [{ name: 'frozen', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'verifier', type: 'address' },
      { name: 'identifier', type: 'string' }
    ],
    name: 'registerVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'verifier', type: 'address' }],
    name: 'announceVerifierRemovalIntent',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getSequenceNumber',
    outputs: [{ name: 'seq', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'data', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'testGovernor', type: 'address' }],
    name: 'mainIsGovernor',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' }
    ],
    name: 'depositReclaim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRegisteredVerifiers',
    outputs: [{ name: '_verifers', type: 'address[]' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'publicInput', type: 'uint256[]' },
      { name: 'applicationData', type: 'uint256[]' }
    ],
    name: 'updateState',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getVaultRoot',
    outputs: [{ name: 'root', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'mainCancelNomination',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'testedAdmin', type: 'address' }],
    name: 'isUserAdmin',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'starkKey', type: 'uint256' },
      { name: 'signature', type: 'bytes' }
    ],
    name: 'register',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'DEPOSIT_CANCEL_DELAY',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newOperator', type: 'address' }],
    name: 'addNewOperator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'unFreeze',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getAssetData',
    outputs: [{ name: 'assetData', type: 'bytes' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getOrderTreeHeight',
    outputs: [{ name: 'height', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newGovernor', type: 'address' }],
    name: 'mainNominateNewGovernor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'UNFREEZE_DELAY',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'starkKey', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'escape',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'governorForRemoval', type: 'address' }],
    name: 'mainRemoveGovernor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'oldAdmin', type: 'address' }],
    name: 'unregisterTokenAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'starkKey', type: 'uint256' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' }
    ],
    name: 'getDepositBalance',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'removedOperator', type: 'address' }],
    name: 'removeOperator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'oldAdmin', type: 'address' }],
    name: 'unregisterUserAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'verifier', type: 'address' }],
    name: 'removeAvailabilityVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'VERIFIER_REMOVAL_DELAY',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'starkKey', type: 'uint256' }],
    name: 'getEtherKey',
    outputs: [{ name: 'etherKey', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'vaultId', type: 'uint256' }],
    name: 'freezeRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'verifierAddress', type: 'address' }],
    name: 'isAvailabilityVerifier',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'verifier', type: 'address' },
      { name: 'identifier', type: 'string' }
    ],
    name: 'registerAvailabilityVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'etherKey', type: 'address' }],
    name: 'getStarkKey',
    outputs: [{ name: 'starkKey', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MAIN_GOVERNANCE_INFO_TAG',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' }
    ],
    name: 'depositCancel',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'verifier', type: 'address' }],
    name: 'removeVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'assetData', type: 'bytes' },
      { name: 'quantum', type: 'uint256' }
    ],
    name: 'registerToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getQuantum',
    outputs: [{ name: 'quantum', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'vaultId', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MAX_VERIFIER_COUNT',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'starkKey', type: 'uint256' },
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'getWithdrawalBalance',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getVaultTreeHeight',
    outputs: [{ name: 'height', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newAdmin', type: 'address' }],
    name: 'registerUserAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'VERSION',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'escapeVerifier', type: 'address' },
      { name: 'initialSequenceNumber', type: 'uint256' },
      { name: 'initialVaultRoot', type: 'uint256' },
      { name: 'initialOrderRoot', type: 'uint256' },
      { name: 'initialVaultTreeHeight', type: 'uint256' },
      { name: 'initialOrderTreeHeight', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'starkKey', type: 'uint256' },
      { indexed: false, name: 'vaultId', type: 'uint256' }
    ],
    name: 'LogFullWithdrawalRequest',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'starkKey', type: 'uint256' },
      { indexed: false, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'LogWithdrawal',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'starkKey', type: 'uint256' },
      { indexed: false, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'LogUserWithdrawal',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'starkKey', type: 'uint256' },
      { indexed: false, name: 'vaultId', type: 'uint256' },
      { indexed: false, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'LogDeposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'starkKey', type: 'uint256' },
      { indexed: false, name: 'vaultId', type: 'uint256' },
      { indexed: false, name: 'tokenId', type: 'uint256' }
    ],
    name: 'LogDepositCancel',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'starkKey', type: 'uint256' },
      { indexed: false, name: 'vaultId', type: 'uint256' },
      { indexed: false, name: 'tokenId', type: 'uint256' }
    ],
    name: 'LogDepositCancelReclaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'sequenceNumber', type: 'uint256' },
      { indexed: false, name: 'vaultRoot', type: 'uint256' },
      { indexed: false, name: 'orderRoot', type: 'uint256' }
    ],
    name: 'LogRootUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'etherKey', type: 'address' },
      { indexed: false, name: 'starkKey', type: 'uint256' }
    ],
    name: 'LogUserRegistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'assetData', type: 'bytes' }
    ],
    name: 'LogTokenRegistered',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'LogFrozen', type: 'event' },
  { anonymous: false, inputs: [], name: 'LogUnFrozen', type: 'event' },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'nominatedGovernor', type: 'address' }],
    name: 'LogNominatedGovernor',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'acceptedGovernor', type: 'address' }],
    name: 'LogNewGovernorAccepted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: 'removedGovernor', type: 'address' }],
    name: 'LogRemovedGovernor',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'LogNominationCancelled',
    type: 'event'
  }
]
