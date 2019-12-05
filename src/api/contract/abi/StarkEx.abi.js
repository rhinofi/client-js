module.exports = [
  {
    "constant": false,
        "inputs": [
        {
            "name": "tokenId",
            "type": "uint256"
        },
        {
            "name": "vaultId",
            "type": "uint256"
        },
        {
            "name": "quantizedAmount",
            "type": "uint256"
        }
        ],
        "name": "deposit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
  },
  {
    "constant": false,
    "inputs": [
    {
        "name": "newAdmin",
        "type": "address"
    }
    ],
    "name": "registerTokenAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "acceptGovernance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "fullWithdrawalRequest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "getFullWithdrawalRequest",
    "outputs": [
    {
        "name": "res",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "verifier",
        "type": "address"
    }
    ],
    "name": "unregisterVerifier",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "verifierAddress",
        "type": "address"
    }
    ],
    "name": "isVerifier",
    "outputs": [
    {
        "name": "addressIsVerifier",
        "type": "bool"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "vaultId",
        "type": "uint256"
    },
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "quantizedAmount",
        "type": "uint256"
    }
    ],
    "name": "acceptDeposit",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "getSequenceNumber",
    "outputs": [
    {
        "name": "seq",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "depositReclaim",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "getRegisteredVerifiers",
    "outputs": [
    {
        "name": "_verifers",
        "type": "address[]"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "getVaultsRoot",
    "outputs": [
    {
        "name": "root",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "DEPOSIT_CANCEL_DELAY",
    "outputs": [
    {
        "name": "",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "newOperator",
        "type": "address"
    }
    ],
    "name": "addNewOperator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "verifier",
        "type": "address"
    }
    ],
    "name": "unregisterVerifierIntent",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "name": "getAssetString",
    "outputs": [
    {
        "name": "assetString",
        "type": "bytes"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "getAssetProxyAddress",
    "outputs": [
    {
        "name": "assetProxyAddress",
        "type": "address"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "vaultId",
        "type": "uint256"
    },
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "quantizedAmount",
        "type": "uint256"
    }
    ],
    "name": "escape",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "oldAdmin",
        "type": "address"
    }
    ],
    "name": "unregisterTokenAdmin",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "getDepositBalance",
    "outputs": [
    {
        "name": "balance",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [],
    "name": "acceptNewOperator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "FULL_WITHDRAWAL_FREEZE_DELAY",
    "outputs": [
    {
        "name": "",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "VERIFIER_REMOVAL_DELAY",
    "outputs": [
    {
        "name": "",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    }
    ],
    "name": "getEtherKey",
    "outputs": [
    {
        "name": "etherKey",
        "type": "address"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "freezeRequest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "etherKey",
        "type": "address"
    }
    ],
    "name": "getStarkKey",
    "outputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "verifier",
        "type": "address"
    }
    ],
    "name": "registerVerifier",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "depositCancel",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "assetString",
        "type": "bytes"
    }
    ],
    "name": "getTokenId",
    "outputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "getVaultsTreeHeight",
    "outputs": [
    {
        "name": "height",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "newGovernor",
        "type": "address"
    }
    ],
    "name": "transferGovernance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "yCoordinate",
        "type": "uint256"
    }
    ],
    "name": "register",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "assetString",
        "type": "bytes"
    },
    {
        "name": "quantum",
        "type": "uint256"
    }
    ],
    "name": "registerToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "name": "getQuantum",
    "outputs": [
    {
        "name": "quantum",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "getTradesRoot",
    "outputs": [
    {
        "name": "root",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "oldVaultRoot",
        "type": "uint256"
    },
    {
        "name": "newVaultRoot",
        "type": "uint256"
    },
    {
        "name": "oldTradeRoot",
        "type": "uint256"
    },
    {
        "name": "newTradeRoot",
        "type": "uint256"
    },
    {
        "name": "vaultsTreeHeightSent",
        "type": "uint256"
    },
    {
        "name": "tradesTreeHeightSent",
        "type": "uint256"
    },
    {
        "name": "availabilityProof",
        "type": "bytes"
    }
    ],
    "name": "stateUpdate",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "clearFullWithdrawalRequest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "MAX_VERIFIER_COUNT",
    "outputs": [
    {
        "name": "",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "publicInput",
        "type": "uint256[]"
    },
    {
        "name": "applicationData",
        "type": "uint256[]"
    },
    {
        "name": "availabilityProof",
        "type": "bytes"
    }
    ],
    "name": "updateState",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "constant": true,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "name": "getWithdrawalBalance",
    "outputs": [
    {
        "name": "balance",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": true,
    "inputs": [],
    "name": "VERSION",
    "outputs": [
    {
        "name": "",
        "type": "string"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
},
{
    "constant": false,
    "inputs": [
    {
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "name": "quantizedAmount",
        "type": "uint256"
    }
    ],
    "name": "acceptWithdrawal",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "name": "assetProxy",
        "type": "address"
    },
    {
        "name": "availabilityVerifier",
        "type": "address"
    },
    {
        "name": "escapeVerifier",
        "type": "address"
    },
    {
        "name": "initialSequenceNumber",
        "type": "uint256"
    },
    {
        "name": "initialVaultRoot",
        "type": "uint256"
    },
    {
        "name": "initialTradeRoot",
        "type": "uint256"
    },
    {
        "name": "initialVaultsTreeHeight",
        "type": "uint256"
    },
    {
        "name": "initialTradesTreeHeight",
        "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "vaultId",
        "type": "uint256"
    }
    ],
    "name": "LogFullWithdrawalRequest",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "quantizedAmount",
        "type": "uint256"
    }
    ],
    "name": "LogWithdrawal",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "vaultId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "quantizedAmount",
        "type": "uint256"
    }
    ],
    "name": "LogDeposit",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "vaultId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "name": "LogDepositCancel",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "starkKey",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "vaultId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    }
    ],
    "name": "LogDepositCancelReclaimed",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "sequenceNumber",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "vaultRoot",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "tradeRoot",
        "type": "uint256"
    }
    ],
    "name": "LogStateUpdate",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "etherKey",
        "type": "address"
    },
    {
        "indexed": false,
        "name": "starkKey",
        "type": "uint256"
    }
    ],
    "name": "LogUserRegistered",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    },
    {
        "indexed": false,
        "name": "assetString",
        "type": "bytes"
    }
    ],
    "name": "LogTokenRegisted",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [],
    "name": "LogFrozen",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "currentOperator",
        "type": "address"
    },
    {
        "indexed": false,
        "name": "candidateOperator",
        "type": "address"
    }
    ],
    "name": "LogOperatorTransfer",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "previousOperator",
        "type": "address"
    },
    {
        "indexed": false,
        "name": "currentOperator",
        "type": "address"
    }
    ],
    "name": "LogOperatorChanged",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "currentGovernor",
        "type": "address"
    },
    {
        "indexed": false,
        "name": "candidateGovernor",
        "type": "address"
    }
    ],
    "name": "LogGovernorTransfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "name": "previousGovernor",
        "type": "address"
    },
    {
        "indexed": false,
        "name": "currentGovernor",
        "type": "address"
    }
    ],
    "name": "LogGovernorChanged",
    "type": "event"
  }
]
