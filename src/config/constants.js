export const contractAddresses = {
	'goerli':{
		'router': '0x297B6caC6AAe8A4eEE69319681359bBab19df555',
		'hedgeFactory': '0xbbd5D17B9aC782709724e16B3ABafB69a4913B09',
		'btc': '0xb0De0355020065b9C05f336B8a267B3CeF69262E',
		'usdc': '0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580',
		'dai': '0x817F61606B7f073854c51ec93beF408708A5b4E4'
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
	'goerli': [
		{value: "btc", chainId: 5, address: "0xb0De0355020065b9C05f336B8a267B3CeF69262E", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "./icons/btc.svg", tags: ["stablecoin"]},
		{value: "dai", chainId: 5, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "./icons/dai.svg", tags: ["stablecoin"]},
		{value: "usdc", chainId: 5, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "USDT", name: "USDT Coin", decimals: 18, logoURL: "./icons/usdc.svg", tags: ["stablecoin"]},
	],
	'fantom': [
	  	{value: "btc", chainId: 4002, address: "0xE1F60643ED560a55b6aF90551c69Ec877DD105D9", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "./icons/btc.svg", tags: ["stablecoin"]},
		{value: "usdc", chainId: 4002, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "USDC", name: "USDC Coin", decimals: 18, logoURL: "./icons/usdc.svg", tags: ["stablecoin"]},
		{value: "eth", chainId: 4002, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "ETH", name: "ETH Coin", decimals: 18, logoURL: "./icons/eth.svg", tags: ["stablecoin"]},
		{value: "dai", chainId: 4002, address: "0x8CaA0072177ccEa341989F0Afd7cA5e6583390b6", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "./icons/dai.svg", tags: ["stablecoin"]},
	]
}

export const poolList = {
	'goerli': [
		{value: "other", address:"0x362b81498cf2eEDEAeE54E7B0215eecA8440B974", symbols:["BTC", "DAI"], logoURLs:["./icons/btc.svg", "./icons/dai.svg"]},
		{value: "other", address:"0x88C61Ba7Ed87228d74fB52Bf081c9918675b664D", symbols:["DAI", "USDT"], logoURLs:["./icons/dai.svg", "./icons/usdc.svg"]}
	],
	'fantom': [
		{value: "btc-eth", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["ETH", "BTC"], logoURLs:["./icons/eth.svg", "./icons/btc.svg"]},
		{value: "usdc-btc", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["BTC", "USDC"], logoURLs:["./icons/btc.svg", "./icons/usdc.svg"]},
		{value: "eth-dai", address:"0x758E5f4caeD36BF1d0Bb23C31387cfF11498D16D", symbols:["ETH", "DAI"], logoURLs:["./icons/eth.svg", "./icons/dai.svg"]},
		{value: "usdc-dai", address:"0xC604a85346523d4e66aBF9c215CFfb13dd154286", symbols:["USDC", "DAI"], logoURLs:["./icons/usdc.svg", "./icons/dai.svg"]}
	]
}
