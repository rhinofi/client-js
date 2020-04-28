module.exports = [
  {
    inputs: [
      {
        internalType: 'contract IFactRegistry',
        name: 'escapeVerifier',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'initialSequenceNumber',
        type: 'uint256'
      },
      { internalType: 'uint256', name: 'initialVaultRoot', type: 'uint256' },
      { internalType: 'uint256', name: 'initialOrderRoot', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'initialVaultTreeHeight',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'initialOrderTreeHeight',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonQuantizedAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantizedAmount',
        type: 'uint256'
      }
    ],
    name: 'LogDeposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'LogDepositCancel',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonQuantizedAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantizedAmount',
        type: 'uint256'
      }
    ],
    name: 'LogDepositCancelReclaimed',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'LogFrozen', type: 'event' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultId',
        type: 'uint256'
      }
    ],
    name: 'LogFullWithdrawalRequest',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'acceptedGovernor',
        type: 'address'
      }
    ],
    name: 'LogNewGovernorAccepted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'nominatedGovernor',
        type: 'address'
      }
    ],
    name: 'LogNominatedGovernor',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'LogNominationCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'LogOperatorAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'LogOperatorRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'removedGovernor',
        type: 'address'
      }
    ],
    name: 'LogRemovedGovernor',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sequenceNumber',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'vaultRoot',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderRoot',
        type: 'uint256'
      }
    ],
    name: 'LogRootUpdate',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAdmin',
        type: 'address'
      }
    ],
    name: 'LogTokenAdminAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenAdmin',
        type: 'address'
      }
    ],
    name: 'LogTokenAdminRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'assetData',
        type: 'bytes'
      }
    ],
    name: 'LogTokenRegistered',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'LogUnFrozen', type: 'event' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'userAdmin',
        type: 'address'
      }
    ],
    name: 'LogUserAdminAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'userAdmin',
        type: 'address'
      }
    ],
    name: 'LogUserAdminRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'etherKey',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      }
    ],
    name: 'LogUserRegistered',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonQuantizedAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantizedAmount',
        type: 'uint256'
      }
    ],
    name: 'LogUserWithdrawal',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'starkKey',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonQuantizedAmount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantizedAmount',
        type: 'uint256'
      }
    ],
    name: 'LogWithdrawal',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'DEPOSIT_CANCEL_DELAY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'FREEZE_GRACE_PERIOD',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MAIN_GOVERNANCE_INFO_TAG',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MAX_VERIFIER_COUNT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'UNFREEZE_DELAY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'VERIFIER_REMOVAL_DELAY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'verifier', type: 'address' }],
    name: 'announceAvailabilityVerifierRemovalIntent',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'verifier', type: 'address' }],
    name: 'announceVerifierRemovalIntent',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' },
      { internalType: 'uint256', name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' }
    ],
    name: 'depositCancel',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' }
    ],
    name: 'depositReclaim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'starkKey', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'quantizedAmount', type: 'uint256' }
    ],
    name: 'escape',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'vaultId', type: 'uint256' }],
    name: 'freezeRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'vaultId', type: 'uint256' }],
    name: 'fullWithdrawalRequest',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getAssetData',
    outputs: [{ internalType: 'bytes', name: 'assetData', type: 'bytes' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'uint256', name: 'starkKey', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' }
    ],
    name: 'getDepositBalance',
    outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'starkKey', type: 'uint256' }],
    name: 'getEtherKey',
    outputs: [{ internalType: 'address', name: 'etherKey', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'uint256', name: 'starkKey', type: 'uint256' },
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' }
    ],
    name: 'getFullWithdrawalRequest',
    outputs: [{ internalType: 'uint256', name: 'res', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getOrderRoot',
    outputs: [{ internalType: 'uint256', name: 'root', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getOrderTreeHeight',
    outputs: [{ internalType: 'uint256', name: 'height', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getQuantum',
    outputs: [{ internalType: 'uint256', name: 'quantum', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRegisteredAvailabilityVerifiers',
    outputs: [
      { internalType: 'address[]', name: '_verifers', type: 'address[]' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getRegisteredVerifiers',
    outputs: [
      { internalType: 'address[]', name: '_verifers', type: 'address[]' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getSequenceNumber',
    outputs: [{ internalType: 'uint256', name: 'seq', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: 'etherKey', type: 'address' }],
    name: 'getStarkKey',
    outputs: [{ internalType: 'uint256', name: 'starkKey', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getVaultRoot',
    outputs: [{ internalType: 'uint256', name: 'root', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getVaultTreeHeight',
    outputs: [{ internalType: 'uint256', name: 'height', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'uint256', name: 'starkKey', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
    ],
    name: 'getWithdrawalBalance',
    outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'verifierAddress', type: 'address' }
    ],
    name: 'isAvailabilityVerifier',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isFrozen',
    outputs: [{ internalType: 'bool', name: 'frozen', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'testedOperator', type: 'address' }
    ],
    name: 'isOperator',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'testedAdmin', type: 'address' }
    ],
    name: 'isTokenAdmin',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'testedAdmin', type: 'address' }
    ],
    name: 'isUserAdmin',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'verifierAddress', type: 'address' }
    ],
    name: 'isVerifier',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
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
    inputs: [
      { internalType: 'address', name: 'testGovernor', type: 'address' }
    ],
    name: 'mainIsGovernor',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'newGovernor', type: 'address' }
    ],
    name: 'mainNominateNewGovernor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'governorForRemoval', type: 'address' }
    ],
    name: 'mainRemoveGovernor',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'starkKey', type: 'uint256' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' }
    ],
    name: 'register',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'verifier', type: 'address' },
      { internalType: 'string', name: 'identifier', type: 'string' }
    ],
    name: 'registerAvailabilityVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'newOperator', type: 'address' }
    ],
    name: 'registerOperator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: 'assetData', type: 'bytes' },
      { internalType: 'uint256', name: 'quantum', type: 'uint256' }
    ],
    name: 'registerToken',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'newAdmin', type: 'address' }],
    name: 'registerTokenAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'newAdmin', type: 'address' }],
    name: 'registerUserAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'verifier', type: 'address' },
      { internalType: 'string', name: 'identifier', type: 'string' }
    ],
    name: 'registerVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'verifier', type: 'address' }],
    name: 'removeAvailabilityVerifier',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'verifier', type: 'address' }],
    name: 'removeVerifier',
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
    constant: false,
    inputs: [
      { internalType: 'address', name: 'removedOperator', type: 'address' }
    ],
    name: 'unregisterOperator',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'oldAdmin', type: 'address' }],
    name: 'unregisterTokenAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'oldAdmin', type: 'address' }],
    name: 'unregisterUserAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256[]', name: 'publicInput', type: 'uint256[]' },
      {
        internalType: 'uint256[]',
        name: 'applicationData',
        type: 'uint256[]'
      }
    ],
    name: 'updateState',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
