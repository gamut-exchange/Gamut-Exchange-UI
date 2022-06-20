const chainId1 = 3;
const chainId2 = 4002;
const RPC_URL1 = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const RPC_URL2 = "https://rpc.testnet.fantom.network/";
const viewBlockUrl1 = "https://ropsten.etherscan.io";
const viewBlockUrl2 = "https://testnet.ftmscan.com/";

export const changeChain = async (chain) => {
  const provider = window.ethereum
  if (provider) {
    try {
      if(chain === "ropsten") {
        await provider.request({
        method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId1.toString(16)}` }],
        });
      } else {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId2.toString(16)}` }],
        });
      }
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the Cronos network on metamask because window.ethereum is undefined")
    return false
  }
}

export default changeChain;