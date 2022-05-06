export const contractAddresses = {
	'ropsten':{
		'router': '0x6Acc995a8306dF36CACD60817Dd3d4F22bCfF8A6',
		'hedgeFactory': '0xD8248ACF1241DBd18E2b44b96BE0fFe42307C06c',
		'btc': '0xFBDBbA81C1A6E1f60d353f31EBeE63Fb03C5F54F',
		'teth': '0x7a177D74A20b72dA96a242bEbEB9f82584Bd0856',
		'usdc': '0x2E1AEDe0C1988542328B7a4BEc49Ee1dCef56B02',
		'dai': '0x09cA4635e760982F07E831dc3E1cb791EFaFfA97'
	},
	'fantom':{
		'router': '0xbbd5D17B9aC782709724e16B3ABafB69a4913B09',
		'hedgeFactory': '0xC19088c49DA26e8F74B28aDFD9D838ad495c3c19',
		'btc': '0x1c63A8233786C1955724A676B87B6a4f5A1E0847',		
		'eth': '0x73B0aF7A379C0126671Db09d7fAf9b8122BAe02D',
		'usdc': '0x7b4B44C987304dF194012d4Ae542629b7C2AC1D0',
		'dai': '0x2bffE1D2251Da22E31f2A769A7DfCDfB75770202',
	}
}

export const uniList = {
	'ropsten': [
		{value: "btc", chainId: 3, address: "0x1CbFD025Eb289b9c806A034cbD48d89234971700", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
		{value: "teth", chainId: 3, address: "0x0f3Cd4D9CFC58Aa42426Fd7742837175ccea5918", symbol: "TETH", name: "TETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
		{value: "usdc", chainId: 3, address: "0x2a12B95Dba4383f2537901Df1f113bbd566A48D1", symbol: "USDC", name: "USDC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", tags: ["stablecoin"]},
		{value: "dai", chainId: 3, address: "0xEC3bE3f94B7E4bc635603537087c53355b180723", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmWe2fZa2d3zbaXkmHF8qAn5RL52V9EdwL3nRxLHwLyGPN", tags: ["stablecoin"]},
	],
	'fantom': [
	  	{value: "btc", chainId: 4002, address: "0xE1F60643ED560a55b6aF90551c69Ec877DD105D9", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
		{value: "usdc", chainId: 4002, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "USDC", name: "USDC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", tags: ["stablecoin"]},
		{value: "eth", chainId: 4002, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "ETH", name: "ETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
		{value: "dai", chainId: 4002, address: "0x8CaA0072177ccEa341989F0Afd7cA5e6583390b6", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmWe2fZa2d3zbaXkmHF8qAn5RL52V9EdwL3nRxLHwLyGPN", tags: ["stablecoin"]},
	]
}

export const poolList = {
	'ropsten': [
		{value: "other", address:"0xF4D4bcc094FA895A3E0588fFa2c72f5EC0Ea8396", symbols:["BTC", "TETH"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe"]},
		{value: "other", address:"0x1719C44ca5bed9590c7D21e5144121eBF762196e", symbols:["TETH", "USDC"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV"]},
		{value: "other", address:"0x5AD90b7A1951015b7B56475b4F5A774bA13e46D8", symbols:["BTC", "USDC"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV"]},
		{value: "other", address:"0x6238E7433AbEB9cf8fde2A64B36701E73743dF6C", symbols:["DAI", "USDC"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmWe2fZa2d3zbaXkmHF8qAn5RL52V9EdwL3nRxLHwLyGPN", "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV"]}
	],
	'fantom': [
		{value: "btc-eth", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["ETH", "BTC"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ"]},
		{value: "usdc-btc", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["BTC", "USDC"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", "https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV"]},
		{value: "eth-dai", address:"0x758E5f4caeD36BF1d0Bb23C31387cfF11498D16D", symbols:["ETH", "DAI"], logoURLs:["https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", "https://gateway.pinata.cloud/ipfs/QmWe2fZa2d3zbaXkmHF8qAn5RL52V9EdwL3nRxLHwLyGPN"]},
		{value: "usdc-dai", address:"0xC604a85346523d4e66aBF9c215CFfb13dd154286", symbols:["USDC", "DAI"], logoURLs:["https://gateway.pinata.cloud/ipfs/Qmf7wTW9iJCKbY8XTq8KQjMhXT8GGoSuA3hjfkKqEwBshV", "https://gateway.pinata.cloud/ipfs/QmWe2fZa2d3zbaXkmHF8qAn5RL52V9EdwL3nRxLHwLyGPN"]}
	]
}
