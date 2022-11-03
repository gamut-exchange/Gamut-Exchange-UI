import WalletConnectors from "../../assets/constants/connectors";

const chainId1 = 5;
const chainId2 = 4002;
const RPC_URL1 = "https://goerli.infura.io/v3/";
const RPC_URL2 = "https://rpc.testnet.fantom.network/";
const viewBlockUrl1 = "https://goerli.etherscan.io/";
const viewBlockUrl2 = "https://testnet.ftmscan.com/";

export const changeChain = async (chain) => {
  const { injected } = WalletConnectors();
  const provider = await injected.getProvider();
  if (provider) {
    try {
      if(chain === "goerli") {
        await provider.request({
        method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId1.toString(16)}` }],
        });
      } else if(chain === "fantom") {
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
    console.error("Can't setup the Blockchain on wallet because provider is undefined")
    return false
  }
}

export default changeChain;
