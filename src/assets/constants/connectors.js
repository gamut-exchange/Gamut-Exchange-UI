import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
const POLLING_INTERVAL = 12000;
const RPC_URL1 = "https://goerli.infura.io/v3/";
const RPC_URL2 = "https://rpc.testnet.fantom.network/";


// export const injected1 = new InjectedConnector({
//     supportedChainIds: [3],
// });

// export const walletconnect1 = new WalletConnectConnector({
//     rpc: { 3: RPC_URL1 },
//     bridge: "https://bridge.walletconnect.org",
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// });

// export const injected2 = new InjectedConnector({
//     supportedChainIds: [80001],
// });

// export const walletconnect2 = new WalletConnectConnector({
//     rpc: { 80001: RPC_URL2 },
//     bridge: "https://bridge.walletconnect.org",
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// });

const walletConnectors = () => {

    const injected = new InjectedConnector({
        supportedChainIds: [5, 4002],
    });
    
    const walletconnect = new WalletConnectConnector({
        rpc: { 5: RPC_URL1, 4002: RPC_URL2 },
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        pollingInterval: POLLING_INTERVAL,
    });

    return {injected, walletconnect};
}

export default walletConnectors;
