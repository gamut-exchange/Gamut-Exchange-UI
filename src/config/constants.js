export const contractAddresses = {
	'router': '0xbbd5D17B9aC782709724e16B3ABafB69a4913B09',
	'hedgeFactory': '0xC19088c49DA26e8F74B28aDFD9D838ad495c3c19',
	'btc': '0xd213f2993eeA1a44C4E35de325aCf0462290D20F',
	'teth': '0xd465a5cDa8DA969557d3f492008b1b09f777Ce81',
}

export const uniList = {
	'ropsten': [
	  {value: "btc", chainId: 3, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
	  {value: "teth", chainId: 3, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "tETH", name: "tETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
	  {value: "usdt", chainId: 3, address: "0x1a4EE0a895357A9eb4F3C689dd458062Bc0Bd27e", symbol: "usdt", name: "USDT Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", tags: ["stablecoin"]},
	],
	'fantom': [
	  {value: "btc", chainId: 4002, address: "0xE1F60643ED560a55b6aF90551c69Ec877DD105D9", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
	  {value: "usdt", chainId: 4002, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "usdt", name: "USDT Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", tags: ["stablecoin"]},
	  {value: "teth", chainId: 4002, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "tETH", name: "tETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
	]
}

export const poolList = {
	'ropsten': [
		{value: "other", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["BTC", "tETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]},
		{value: "other", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["USDT", "tETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]}
	],
	'fantom': [
		{value: "btc-teth", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["BTC", "tETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]},
		{value: "usdt-teth", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["USDT", "tETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]}
	]
}
