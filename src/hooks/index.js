import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import WalletConnectors from "../assets/constants/connectors";
import * as actions from "./_api";

export function useEagerConnect() {
  const { injected, walletconnect } = WalletConnectors();
  const selected_chain = useSelector((state) => state.selectedChain);
  const { activate, active, connector } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
      console.log(injected);
    injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    if (connector == walletconnect) {
      walletconnect.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(walletconnect, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
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
  const { injected, walletconnect } = WalletConnectors();
  const { selected_chain } = useSelector((state) => state.selectedChain);
  const { active, error, activate, connector } = useWeb3React();

  useEffect(() => {
    if (connector === injected && !active && !error && !suppress) {
      const { ethereum } = window;
      const handleChainChanged = (chainId) => {
        console.log("chainChanged", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      const handleNetworkChanged = (networkId) => {
        console.log("networkChanged", networkId);
        activate(injected);
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }
    if (connector === walletconnect && !active && !error && !suppress) {
      // Subscribe to accounts change
      walletconnect.on("accountsChanged", (accounts) => {
        console.log(accounts);
      });

      // Subscribe to chainId change
      walletconnect.on("chainChanged", (chainId) => {
        console.log(chainId);
      });

      // Subscribe to session disconnection
      walletconnect.on("disconnect", (code, reason) => {
        console.log(code, reason);
      });
    }

    return () => {};
  }, [active, error, suppress, activate]);
}

export const useApi = () => {
  return actions;
};
