import { useWeb3React } from "@web3-react/core";
import WalletConnectors from "./connectors";
import MetaMaskLogo from "../img/wallets/meta-mask.svg";
import WalletConnect from "../img/wallets/wallet-connect.svg";

const {injected, walletconnect1, walletconnect2} = WalletConnectors();

const Wallets1 = [
    {
        title: "MetaMask",
        description: "Connect to your MetaMask Wallet",
        logo: MetaMaskLogo,
        connector: injected,
    },
    {
        title: "WalletConnect",
        description: "Connect to your WalletConnect Wallet",
        logo: WalletConnect,
        connector: walletconnect1,
    }
];

const Wallets2 = [
    {
        title: "MetaMask",
        description: "Connect to your MetaMask Wallet",
        logo: MetaMaskLogo,
        connector: injected,
    },
    {
        title: "WalletConnect",
        description: "Connect to your WalletConnect Wallet",
        logo: WalletConnect,
        connector: walletconnect2,
    }
];

const ConnectedWallet = () => {
    const { connector } = useWeb3React();
    if (connector) {
        switch (connector) {
            case injected: {
                return {
                    name: "MetaMask",
                    logo: MetaMaskLogo,
                };
            }
            case walletconnect1: {
                return {
                    name: "WalletConnect",
                    logo: WalletConnect,
                };
            }
            case walletconnect2: {
                return {
                    name: "WalletConnect",
                    logo: WalletConnect,
                };
            }
            default : {
                return {
                    name: "MetaMask",
                    logo: MetaMaskLogo,
                };
            }
        }
    } else {
        return {};
    }
};

export { Wallets1, Wallets2, ConnectedWallet };
