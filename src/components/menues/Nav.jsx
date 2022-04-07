import { Link } from "react-router-dom";
import { useState } from "react";
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


const Nav = ({ handleDark, dark }) => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [openWalletList, setOpenWalletList] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chainLabel, setChainLabel] = useState('Ropsten');

  const classes = useStyles.header();
  const isMobile = useMediaQuery("(max-width:600px)");

  const { account } = useWeb3React();

  const cWallet = ConnectedWallet();

  const menuOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChain = (chain) => {
    if(chain != '')
      setChainLabel(chain);
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setIsToggleOpen((prevState) => !prevState);
  };
  return (
    <div
      style={{ minHeight: 90 }}
      className="w-full bg-white-bg border-b border-grey-dark dark:border-grey-light dark:bg-dark-primary py-4 relative z-50 flex"
    >
      <div className="main-container">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-8">
            <Link to={`/`}>
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
              style={{borderRadius:'0px'}}
              onClose={() => handleChain('')}
              PopoverClasses={{
                borderRadius:'0px'
              }}
            >
              <MenuItem key="ropsten" onClick={() => handleChain('Ropsten')}>Ropsten</MenuItem>
              <MenuItem key="mumbai" onClick={() => handleChain('Mumbai')}>Mumbai</MenuItem>
              <MenuItem key="fantom" onClick={() => handleChain('Fantom')}>Fantom</MenuItem>
            </Menu>
            <Box className={classes.actionGroup}>
              <Box className={classes.connectWallet}>
                  {(() => {
                      if (account) {
                          return (
                              <Button
                                  variant="contained"
                                  className="btn-primary dark:text-dark-primary w-full"
                                  style={{borderRadius:'0px', minHeight:44, fontSize:18}}
                                  startIcon={
                                      cWallet && <img width={22} src={cWallet.logo} alt={cWallet.name} />
                                  }
                                  onClick={() => {
                                      setOpenWalletList(true);
                                  }}
                                  className={isMobile ? classes.hide : ""}
                              >
                                  {`${account.substring(0, 8)} ... ${account.substring(account.length - 4)}`}
                              </Button>
                          )
                      } else {
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
                    open={menuOpen}
                    onClose={() => handleChain('')}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem key="ropsten" onClick={() => handleChain('Ropsten')}>Ropsten</MenuItem>
                    <MenuItem key="mumbai" onClick={() => handleChain('Mumbai')}>Mumbai</MenuItem>
                    <MenuItem key="fantom" onClick={() => handleChain('Fantom')}>Fantom</MenuItem>
                  </Menu>
                  <Box className={classes.actionGroup}>
                    <Box className={classes.connectWallet}>
                        {(() => {
                            if (account) {
                                return (
                                    <Button
                                        variant="contained"
                                        style={{borderRadius:'0px', minHeight:36, fontSize:16}}
                                        startIcon={
                                            cWallet && <img width={22} src={cWallet.logo} alt={cWallet.name} />
                                        }
                                        onClick={() => {
                                            setOpenWalletList(true);
                                        }}
                                        className={isMobile ? classes.hide : ""}
                                    >
                                        {`${account.substring(0, 8)} ... ${account.substring(account.length - 4)}`}
                                    </Button>
                                )
                            } else {
                                return (
                                    <Button
                                        variant="contained"
                                        style={{borderRadius:'0px', minHeight:36, fontSize:16}}
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
