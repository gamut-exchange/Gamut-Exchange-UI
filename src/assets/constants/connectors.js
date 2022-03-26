import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;
const RPC_URL = "https://ropsten.infura.io/v3";

export const injected = new InjectedConnector({
    supportedChainIds: [3],
});

export const walletconnect = new WalletConnectConnector({
    rpc: { 3: RPC_URL },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});
