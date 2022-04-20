import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useWeb3React } from "@web3-react/core";
import Drawer from "react-modern-drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "react-modern-drawer/dist/index.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import log from "../../images/logo.svg";

// ** Import Assets
import useStyles from "../../assets/styles";
import Logo from "../../assets/img/logo.png";
import LogoMobile from "../../assets/img/logoMobile.png";


// ** Import Components
import ConnectWallet from "../ConnectWallet";
import { ConnectedWallet } from "../../assets/constants/wallets";
import { SELECT_CHAIN } from "../../redux/constants";


const Nav = ({ handleDark, dark }) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const cWallet = ConnectedWallet();
  const [openWalletList, setOpenWalletList] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const selected_chain = useSelector((state) => state.selectedChain);
  const [chainLabel, setChainLabel] = useState(selected_chain);
  const [connectedWallet, setConnectedWallet] = useState(cWallet);
  const [wrongChain, setWrongChain] = useState(true);


  const classes = useStyles.header();
  const isMobile = useMediaQuery("(max-width:600px)");

  const { chainId, account, active, activate, deactivate } = useWeb3React();
  const dispatch = useDispatch();

  const menuOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChain = async (chain) => {
    handleClose();
    if(chain != '') {
      if(chainLabel !== chain) {
        setChainLabel(chain);
        deactivate();
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setIsToggleOpen((prevState) => !prevState);
  };

  const handleWrongChain = async () => {
    let current_chainId = await window.ethereum.request({ method: 'eth_chainId' });
    current_chainId = Number(current_chainId);
    debugger;
    if((chainLabel === "ropsten" && current_chainId === 3) || (chainLabel === "fantom" && current_chainId === 4002)) {
      setWrongChain(false);
      dispatch({
          type:SELECT_CHAIN,
          payload: chainLabel
      });
    }
    else {
      setWrongChain(true);
    }
  }

  useEffect(() => {
    handleWrongChain();
  }, [dispatch, chainLabel, activate, deactivate, setChainLabel, active]);

  return (
    <div
      style={{ minHeight: 90 }}
      className="w-full bg-white-bg border-b border-grey-dark dark:border-grey-light dark:bg-dark-primary py-4 relative z-50 flex"
    >
      <div className="main-container">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-8">
            <Link to="/">
              <img src={log} alt="logo" />
            </Link>
            <div className="hidden md:flex items-center gap-x-8">
              <ul className="flex gap-x-7">
                <li>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/swap'
                  >
                    Swap
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/liquidity'
                  >
                    Liquidity
                  </Link>
                </li>
                {/* <li>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/mine'
                  >
                    Liquidity Mining
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/lock'
                  >
                    Gnt Lock
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/lp_tokens'
                  >
                    LP Tokens
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="hidden md:flex gap-x-6 items-center">
            <Link
              className="text-light-primary dark:text-grey-dark transition-all duration-300"
              to='/faucet'
            >
              Faucet
            </Link>
            <button onClick={handleDark} className="text-2xl">
              {!dark ? (
                <BsToggleOff className="text-black" />
              ) : (
                <div className="text-white">
                  {" "}
                  <BsToggleOn />
                </div>
              )}{" "}
            </button>
            <Button
              id="basic-button"
              className="text-light-primary dark:text-grey-dark transition-all duration-300"
              aria-controls={menuOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              {chainLabel}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              classes={{ paper: dark?classes.darkMenuWrapper:classes.menuWrapper }}
            >
              <MenuItem key="ropsten" onClick={() => handleChain('ropsten')}>Ropsten</MenuItem>
              <MenuItem key="fantom" onClick={() => handleChain('fantom')}>Fantom</MenuItem>
            </Menu>
            <Box className={classes.actionGroup}>
              <Box className={classes.connectWallet}>
                  {(() => {
                      if (wrongChain) {
                          return (
                              <Button
                                  variant="contained"
                                  className="btn-primary dark:text-dark-primary w-full"
                                  style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                  onClick={() => {
                                      setOpenWalletList(true);
                                  }}
                                 
                              >
                                  Wrong Chain
                              </Button>
                          )
                      } else {
                        if(account)
                          return (
                              <Button
                                  variant="contained"
                                  className="btn-primary dark:text-dark-primary w-full"
                                  style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                  startIcon={
                                      connectedWallet && <img width={22} src={connectedWallet.logo} alt={connectedWallet.name} />
                                  }
                                  onClick={() => {
                                      setOpenWalletList(true);
                                  }}
                                  className={isMobile ? classes.hide : ""}
                              >
                                  {`${account.substring(0, 8)} ... ${account.substring(account.length - 4)}`}
                              </Button>
                          )
                        else
                          return (
                              <Button
                                  variant="contained"
                                  className="btn-primary dark:text-dark-primary w-full"
                                  style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                  onClick={() => {
                                      setOpenWalletList(true);
                                  }}
                                 
                              >
                                  Connect Wallet
                              </Button>
                          )
                      }
                  })()}
              </Box>
            </Box>
          </div>
          <ConnectWallet
              isOpen={openWalletList}
              setIsOpen={setOpenWalletList}
              chain={chainLabel}
              wrongChain={wrongChain}
              dark={dark}
          />
          <div className="md:hidden flex items-center">
            <button
              className="text-light-primary dark:text-grey-dark text-2xl"
              onClick={toggleDrawer}
            >
              <GiHamburgerMenu />
            </button>
            <Drawer open={isToggleOpen} onClose={toggleDrawer} direction="left">
              <div className="bg-white-bg dark:bg-dark-primary h-full w-full py-10 px-4">
                <Link to={`/`}>
                  <img src={log} alt="logo" />
                </Link>
                <div className="flex flex-col gap-y-6 items-start px-4 mt-7">
                  <div className="flex items-center justify-between w-full order-last">
                    <p className="text-light-primary text-xs dark:text-grey-dark">
                      Change colour mode
                    </p>
                    <button onClick={handleDark} className="text-2xl">
                      {!dark ? (
                        <BsToggleOff />
                      ) : (
                        <div className="text-white">
                          {" "}
                          <BsToggleOn />
                        </div>
                      )}{" "}
                    </button>
                  </div>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/swap'
                  >
                    Swap
                  </Link>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/liquidity'
                  >
                    Liquidity
                  </Link>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/mine'
                  >
                    Liquidity Mining
                  </Link>
                  <Link
                    className="text-light-primary dark:text-grey-dark transition-all duration-300"
                    to='/lock'
                  >
                    Gnt Lock
                  </Link>
                  <Link
                      className="text-light-primary dark:text-grey-dark transition-all duration-300"
                      to='/lp_tokens'
                    >
                      LP Tokens
                  </Link>
                  <Button
                    id="basic-button"
                    aria-controls={menuOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    {chainLabel}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={menuOpen}
                    classes={{ paper: dark?classes.darkMenuWrapper:classes.menuWrapper }}
                  >
                    <MenuItem key="ropsten" onClick={() => handleChain('ropsten')} selected={selected_chain==="ropsten"}>Ropsten</MenuItem>
                    <MenuItem key="fantom" onClick={() => handleChain('fantom')} selected={selected_chain==="fantom"}>Fantom</MenuItem>
                  </Menu>
                  <Box className={classes.actionGroup}>
                    <Box className={classes.connectWallet}>
                        {(() => {
                            if (wrongChain) {
                                return (
                                    <Button
                                        variant="contained"
                                        className="btn-primary dark:text-dark-primary w-full"
                                        style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                        onClick={() => {
                                            setOpenWalletList(true);
                                        }}
                                       
                                    >
                                        Wrong Chain
                                    </Button>
                                )
                            } else {
                              if(account)
                                return (
                                    <Button
                                        variant="contained"
                                        className="btn-primary dark:text-dark-primary w-full"
                                        style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                        startIcon={
                                            connectedWallet && <img width={22} src={connectedWallet.logo} alt={connectedWallet.name} />
                                        }
                                        onClick={() => {
                                            setOpenWalletList(true);
                                        }}
                                        className={isMobile ? classes.hide : ""}
                                    >
                                        {`${account.substring(0, 8)} ... ${account.substring(account.length - 4)}`}
                                    </Button>
                                )
                              else
                                return (
                                    <Button
                                        variant="contained"
                                        className="btn-primary dark:text-dark-primary w-full"
                                        style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                        onClick={() => {
                                            setOpenWalletList(true);
                                        }}
                                       
                                    >
                                        Connect Wallet
                                    </Button>
                                )
                            }
                        })()}
                    </Box>
                  </Box>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;

const links = [
  { id: 1, text: "Liquidity", url: "/liquidity" },
  { id: 2, text: "Swap", url: "/swap" },

];
