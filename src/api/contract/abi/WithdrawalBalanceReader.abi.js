module.exports = [
  {
    inputs: [
      { internalType: "address", name: "_starkContract", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" },
      { internalType: "uint256", name: "_whoKey", type: "uint256" },
    ],
    name: "allWithdrawalBalances",
    outputs: [
      { internalType: "uint256[]", name: "balances", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
