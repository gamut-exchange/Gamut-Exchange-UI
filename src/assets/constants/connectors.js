import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useSelector } from "react-redux";
const POLLING_INTERVAL = 12000;
const RPC_URL1 = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
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
        supportedChainIds: [3, 4002],
    });
    
    const walletconnect1 = new WalletConnectConnector({
        rpc: { 3: RPC_URL1 },
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        pollingInterval: POLLING_INTERVAL,
    });

    const walletconnect2 = new WalletConnectConnector({
        rpc: { 4002: RPC_URL2 },
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        pollingInterval: POLLING_INTERVAL,
    });

    return {injected, walletconnect1, walletconnect2};
}

export default walletConnectors;
