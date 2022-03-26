import { Link } from "react-router-dom";
import { useState } from "react";
import Drawer from "react-modern-drawer";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import "react-modern-drawer/dist/index.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import log from "../../images/logo.svg";

const Nav = ({ handleDark, dark }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
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
                <li>
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
                </li>
              </ul>
            </div>
          </div>

          <div className="hidden md:flex gap-x-6 items-center">
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
            <Link
              style={{ width: 166, height: 49 }}
              className="btn-primary font-sans  dark:text-dark-primary"
              to="/"
            >
              Connect
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="text-light-primary dark:text-grey-dark text-2xl"
              onClick={toggleDrawer}
            >
              <GiHamburgerMenu />
            </button>
            <Drawer open={isOpen} onClose={toggleDrawer} direction="left">
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
                  <Link
                    style={{ height: 49 }}
                    className="btn-primary font-sans w-full dark:text-dark-primary"
                    to="/"
                  >
                    Connect
                  </Link>
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
