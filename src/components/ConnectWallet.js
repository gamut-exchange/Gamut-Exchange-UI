import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
// ** Web3 React
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
    URI_AVAILABLE,
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
// ** Import Material-Ui Components
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Alert from "@mui/lab/Alert";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonGroup from "@mui/material/ButtonGroup";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

// ** Import Material Icons
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ReplayIcon from '@mui/icons-material/Replay';

// ** Import Assets
import useStyles from "../assets/styles";
import { Wallets1, Wallets2, ConnectedWallet } from "../assets/constants/wallets";
import changeChain from "../assets/constants/changeChain";
import walletConnectors from "../assets/constants/connectors";
import { useEagerConnect, useInactiveListener } from "../hooks";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CHANGE_WALLET } from "../redux/constants";

const {injected1, injected2, walletconnect1, walletconnect2} = walletConnectors();

const ConnectWallet = ({ isOpen, setIsOpen, chain, wrongChain, dark }) => {
    const classes = useStyles.base();
    const dispatch = useDispatch();
    const triedEager = useEagerConnect();
    const { activate, active, account, chainId, deactivate, connector, error, setError } =
        useWeb3React();
    const cWallet = ConnectedWallet();


    // const injected = (chain==="ropsten")?injected1:injected2;
    const walletconnect = (chain==="ropsten")?walletconnect1:walletconnect2;
    const Wallets = (chain==="ropsten")?Wallets1:Wallets2;
    const selected_chain = useSelector((state) => state.selectedChain);
    const [activatingConnector, setActivatingConnector] = React.useState();

    useEffect(() => {
        dispatch({
            type:CHANGE_WALLET,
            payload: account
        })
    }, [account])
    // ** Actions
    const copyAddress = () => {
        alert(`Copied to clipboard.`, "info");
    };
    const viewBlockUrl1 = (account) => {
        window.open(`https://ropsten.etherscan.io/address/${account}`);
    };

    const viewBlockUrl2 = (account) => {
        window.open(`https://polygonscan.com/address/${account}`);
    };

    useInactiveListener(!triedEager);

    // ** Actions
    const retryConnect = () => {
        setError(false);
    };
    const onConnectWallet = async (item) => {
        setActivatingConnector(item.connector);
        await activate(item.connector);
    };
    const onDeactiveWallet = () => {
        deactivate();
    };
    const handleCloseWalletList = () => {
        setIsOpen(false);
    };
    const getErrorMessage = (error) => {
        if (error instanceof NoEthereumProviderError) {
            return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
        } else if (error instanceof UnsupportedChainIdError) {
            return "You're connected to an unsupported network.";
        } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect ||
            error instanceof UserRejectedRequestErrorFrame
        ) {
            return "Please authorize this website to access your Ethereum account.";
        } else {
            console.error(error);
            return "An unknown error occurred. Check the console for more details.";
        }
    };

    const handleChainChange = async () => {
        setIsOpen(false);
        await changeChain(chain);
    }

    useEffect(() => {
        const initialData = async () => {
            const logURI = (uri) => {
                console.log("WalletConnect URI", uri);
            };
            walletconnect.on(URI_AVAILABLE, logURI);
            return () => {
                walletconnect.off(URI_AVAILABLE, logURI);
            };
        }
        initialData();
    }, []);

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    return (
        <Dialog
            className={`${
                dark
                  ? "dark transition-all duration-700 ease-in-out"
                  : "light transition-all duration-700 ease-in-out"
              } w-full transition-all duration-700 ease-in-out`}
            onClose={handleCloseWalletList}
            classes={{
                paper: dark?classes.darkConnectWallet:classes.connectWallet,
            }}
            open={isOpen}
            fullWidth={true}
        >
            {error && <Alert severity="error" action={
                <Button color="primary" onClick={() => retryConnect()}>
                    <ReplayIcon />
                </Button>
            }>{getErrorMessage(error)}</Alert>}
            <DialogTitle className="action" style={{paddingLeft:0}}>
                {(active && !wrongChain) && <Typography style={{fontSize:20}}>Account</Typography>}
                {(wrongChain) && <Typography style={{fontSize:20}}>Change Network</Typography>}
            </DialogTitle>
            {active && (!wrongChain?(
                <Box className={classes.connectWalletButton}>
                    {cWallet && 
                        <Button endIcon={<img src={cWallet.logo} alt={cWallet.name} />}>
                            <Typography variant="caption">
                                {`${cWallet.name} Connected`}
                            </Typography>
                        </Button>
                    }
                    <TextField
                        inputProps={{
                            readOnly: true,
                            style:{ color: '#4b6998', border:'1px solid gray' }
                        }}
                        value={
                            account
                                ? `${account.substring(
                                    0,
                                    16
                                )} ... ${account.substring(
                                    account.length - 4
                                )}`
                                : "Connect Wallet"
                        }
                    />
                    <ButtonGroup
                        className="buttonGroup"
                        color="primary"
                        aria-label="outlined primary button group"
                    >
                        <CopyToClipboard
                            text={account}
                            onCopy={() => copyAddress()}
                        >
                            <Button
                                onClick={() => copyAddress()}
                                startIcon={<FileCopyOutlinedIcon />}
                            >
                                <Typography variant="caption">Copy</Typography>
                            </Button>
                        </CopyToClipboard>
                        <Button
                            onClick={() => viewBlockUrl2(account)}
                            startIcon={<OpenInNewOutlinedIcon />}
                        >
                            <Typography variant="caption">View</Typography>
                        </Button>
                        <Button
                            onClick={() => onDeactiveWallet()}
                            startIcon={<ExitToAppOutlinedIcon />}
                        >
                            <Typography variant="caption">
                                Deactivate
                            </Typography>
                        </Button>
                    </ButtonGroup>
                </Box>
            ):(
                <button
                  variant="contained"
                  className="btn-primary dark:text-dark-primary w-full"
                  style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                  onClick={handleChainChange}
                >
                  Connect to {chain.toUpperCase()}
                </button>
            ))}
            {!active ? ((!wrongChain)?(
                <List className="wallet-list">
                    {Wallets.map((item, idx) => {
                        const activating =
                            item.connector === activatingConnector;
                        const connected = item.connector === connector;
                        const disabled =
                            !triedEager ||
                            !!activatingConnector ||
                            connected ||
                            !!error;
                        return (
                            <ListItem
                                button
                                key={idx}
                                className="item"
                                disabled={disabled}
                                onClick={() => onConnectWallet(item)}
                            >
                                <ListItemIcon className="symbol">
                                    {activating ? (
                                        <CircularProgress />
                                    ) : (
                                        <img src={item.logo} alt={item.logo} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    secondaryTypographyProps={{color:'#4b6998'}}
                                    secondary={
                                        activating
                                            ? "Initializing..."
                                            : item.description
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            ):(
                <button
                  variant="contained"
                  className="btn-primary dark:text-dark-primary w-full"
                  style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                  onClick={handleChainChange}
                >
                  Connect to {chain.toUpperCase()}
                </button>
            )) : (
                ""
            )}
        </Dialog>
    );
};

export default ConnectWallet;
