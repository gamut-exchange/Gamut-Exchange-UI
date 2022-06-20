import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import WalletConnectors from "../assets/constants/connectors";
import * as actions from "./_api";

export function useEagerConnect() {
    const {injected, walletconnect1, walletconnect2} = WalletConnectors();
    const selected_chain = useSelector((state) => state.selectedChain);
    const { activate, active } = useWeb3React();
    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}

export function useInactiveListener(suppress = false) {
    const {injected, walletconnect1, walletconnect2} = WalletConnectors();
    const { selected_chain } = useSelector((state) => state.selectedChain);
    const { active, error, activate } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = (chainId) => {
                activate(injected);
            };

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    activate(injected);
                }
            };

            // const handleNetworkChanged = (networkId) => {
            //     activate(injected);
            // };

            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            // ethereum.on("networkChanged", handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("chainChanged", handleChainChanged);
                    ethereum.removeListener(
                        "accountsChanged",
                        handleAccountsChanged
                    );
                    // ethereum.removeListener(
                    //     "networkChanged",
                    //     handleNetworkChanged
                    // );
                }
            };
        }

        return () => {};
    }, [active, error, suppress, activate]);
}

export const useApi = () => {
    return actions;
};
