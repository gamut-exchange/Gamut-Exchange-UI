const routerABI = [
    [
        {
            "inputs": [
                {
                    "internalType": "contract IWETH",
                    "name": "_weth",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "liquidityProvider",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "contract IERC20[]",
                    "name": "tokens",
                    "type": "address[]"
                },
                {
                    "indexed": false,
                    "internalType": "int256[]",
                    "name": "deltas",
                    "type": "int256[]"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[]",
                    "name": "protocolFeeAmounts",
                    "type": "uint256[]"
                }
            ],
            "name": "PoolBalanceChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "contract IERC20",
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "contract IERC20",
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "protocolSwapFeeAmount",
                    "type": "uint256"
                }
            ],
            "name": "Swap",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "Factory",
            "outputs": [
                {
                    "internalType": "contract IHedgeFactory",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "assetInIndex",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "assetOutIndex",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Router.BatchSwapStep[]",
                    "name": "swaps",
                    "type": "tuple[]"
                },
                {
                    "internalType": "address[]",
                    "name": "assets",
                    "type": "address[]"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "address payable",
                            "name": "recipient",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct Router.FundManagement",
                    "name": "funds",
                    "type": "tuple"
                },
                {
                    "internalType": "int256[]",
                    "name": "limits",
                    "type": "int256[]"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "batchSwap",
            "outputs": [
                {
                    "internalType": "int256[]",
                    "name": "assetDeltas",
                    "type": "int256[]"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "contract IERC20[]",
                            "name": "tokens",
                            "type": "address[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "minAmountsOut",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "bytes",
                            "name": "userData",
                            "type": "bytes"
                        }
                    ],
                    "internalType": "struct Router.ExitPoolRequest",
                    "name": "request",
                    "type": "tuple"
                }
            ],
            "name": "exitPool",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "components": [
                        {
                            "internalType": "contract IERC20[]",
                            "name": "tokens",
                            "type": "address[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "maxAmountsIn",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "bytes",
                            "name": "userData",
                            "type": "bytes"
                        }
                    ],
                    "internalType": "struct Router.JoinPoolRequest",
                    "name": "request",
                    "type": "tuple"
                }
            ],
            "name": "joinPool",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract IHedgeFactory",
                    "name": "_factory",
                    "type": "address"
                }
            ],
            "name": "setHedgeFactory",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "tokenIn",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenOut",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Router.SingleSwap",
                    "name": "singleSwap",
                    "type": "tuple"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "address payable",
                            "name": "recipient",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct Router.FundManagement",
                    "name": "funds",
                    "type": "tuple"
                },
                {
                    "internalType": "uint256",
                    "name": "limit",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "deadline",
                    "type": "uint256"
                }
            ],
            "name": "swap",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amountCalculated",
                    "type": "uint256"
                }
            ],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ]
]

export default routerABI;