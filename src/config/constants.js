export const contractAddresses = {
	'ropsten':{
		'router': '0xbbd5D17B9aC782709724e16B3ABafB69a4913B09',
		'hedgeFactory': '0xC19088c49DA26e8F74B28aDFD9D838ad495c3c19',
		'btc': '0xd213f2993eeA1a44C4E35de325aCf0462290D20F',
		'teth': '0xd465a5cDa8DA969557d3f492008b1b09f777Ce81',
	},
	'fantom':{
		'router': '0xbbd5D17B9aC782709724e16B3ABafB69a4913B09',
		'hedgeFactory': '0xC19088c49DA26e8F74B28aDFD9D838ad495c3c19',
		'btc': '0x1c63A8233786C1955724A676B87B6a4f5A1E0847',
		'teth': '0x73B0aF7A379C0126671Db09d7fAf9b8122BAe02D',
		'usdt': '0x7b4B44C987304dF194012d4Ae542629b7C2AC1D0',
		'dai': '0x2bffE1D2251Da22E31f2A769A7DfCDfB75770202'
	}
}

export const uniList = {
	'ropsten': [
	  {value: "btc", chainId: 3, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
	  {value: "teth", chainId: 3, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "TETH", name: "TETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
	  {value: "usdt", chainId: 3, address: "0x1a4EE0a895357A9eb4F3C689dd458062Bc0Bd27e", symbol: "USDT", name: "USDT Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", tags: ["stablecoin"]},
	],
	'fantom': [
	  {value: "btc", chainId: 4002, address: "0xE1F60643ED560a55b6aF90551c69Ec877DD105D9", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
	  {value: "usdt", chainId: 4002, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "USDT", name: "USDT Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", tags: ["stablecoin"]},
	  {value: "teth", chainId: 4002, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "TETH", name: "TETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
	  {value: "dai", chainId: 4002, address: "0x8CaA0072177ccEa341989F0Afd7cA5e6583390b6", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
	]
}

export const poolList = {
	'ropsten': [
		{value: "other", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["BTC", "TETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]},
		{value: "other", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["USDT", "TETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]}
	],
	'fantom': [
		{value: "btc-teth", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["BTC", "TETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]},
		{value: "usdt-btc", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["USDT", "BTC"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ"]},
		{value: "teth-dai", address:"0x758E5f4caeD36BF1d0Bb23C31387cfF11498D16D", symbols:["TETH", "DAI"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ"]},
		{value: "usdt-dai", address:"0xC604a85346523d4e66aBF9c215CFfb13dd154286", symbols:["USDT", "DAI"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ"]},
	]
}
