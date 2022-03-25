import React, { useState } from "react";
import {
  Autocomplete,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import eth from "../../../images/crypto/ethlg.svg";
import btc from "../../../images/crypto/btclg.svg";
import ethsm from "../../../images/crypto/eth.svg";
import { ImLoop } from "react-icons/im";

const LiquidityPools = ({ handleMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sorted, setSorted] = useState("");

  const handleDeposit = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleChange = (event) => {
    setSorted(event.target.value);
  };

  return (
    <div className="pb-[74px]">
      <div className="py-6 border-b border-white mb-7">
        <h3 className="model-title mb-5">Liquidity Pools</h3>
        <hr className="border-grey-dark " />
      </div>
      <div className="flex  mb-8 justify-between sm:justify-start flex-wrap gap-y-4 items-center">
        <button
          className="flex items-center sm:order-first order-2 text-grey-dark text-base "
          onClick={handleDeposit}
        >
          Deposits only:{" "}
          <span className="text-light-primary dark:text-grey-dark text-3xl ml-3">
            {isOpen ? (
              <BsToggleOff />
            ) : (
              <div className="">
                <BsToggleOn />
              </div>
            )}
          </span>
        </button>
        <div
          style={{ maxWidth: 452 }}
          className="flex items-center sm:flex-row flex-col gap-y-4 ml-auto w-full gap-x-5"
        >
          <div className="w-full">
            <FormControl sx={{ width: "100%" }}>
              <Select
                sx={{ height: 56 }}
                value={sorted}
                onChange={handleChange}
                displayEmpty
                // inputProps={{ "aria-label": "Without label" }}
                className="bg-white-bg dark:bg-dark-primary"
              >
                <MenuItem value="">
                  <em>
                    <div className="flex gap-x-4 items-center">
                      <img src={ethsm} alt="" />
                      <p className="text-light-primary uppercase dark:text-grey-dark">
                        btc
                      </p>
                    </div>
                  </em>
                </MenuItem>
                {ethlist.map((list) => {
                  const { id, icon, value } = list;
                  return (
                    <MenuItem key={id} value={value}>
                      <div className="flex gap-x-4 items-center ">
                        <img src={icon} alt="" />
                        <p className="text-light-primary uppercase dark:text-grey-dark">
                          {value}
                        </p>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <Autocomplete
            sx={{ width: "100%" }}
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={ethlist.map((option) => option.value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
        </div>
        <button
          onClick={handleMode}
          className="text-light-primary  sm:hidden order-last ml-8 gap-x-4 flex items-center dark:text-grey-dark"
        >
          <p className="capitalize"> simple mode</p>
          <span className="text-2xl">
            <ImLoop />
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-y-6">
        {modellist.map((item) => {
          const { id, icon, btc, value, apr, liq } = item;
          return (
            <div
              key={id}
              className=" p-6 dark:bg-off-white dark:bg-opacity-10 rounded border border-grey-dark "
            >
              <div className="flex items-center justify-between gap-y-4 flex-wrap gap-x-1">
                <div className="flex items-center gap-y-4">
                  <div className="relative flex ">
                    <img src={icon} alt="" />
                    <img className="z-10 relative right-2" src={btc} alt="" />
                  </div>
                  <p className="text-light-primary text-xl dark:text-grey-dark">
                    {value}
                  </p>
                </div>
                <div className="flex items-center max-w-[600px] justify-center flex-wrap  gap-x-4 gap-y-4 w-full ">
                  <div className="flex-1">
                    <div>
                      <p className="list-title-small mb-1">TOTAL APR%</p>
                      <div className="list-value">{apr}</div>
                    </div>{" "}
                  </div>
                  <div className="flex-1">
                    <div>
                      {" "}
                      <p className="list-title-small mb-1">TOTAL liq%</p>
                      <div className="list-value">{liq}</div>
                    </div>{" "}
                  </div>
                  <div className="sm:flex-1 w-full sm:w-auto flex sm:justify-end">
                    <button
                      style={{ height: 57 }}
                      className="text-lg border border-light-primary  w-full sm:max-w-170 font-bold dark:text-grey-dark text-light-primary dark:bg-dark-primary rounded"
                    >
                      Claim Unlock
                    </button>
                  </div>
                  <button
                    // onClick={() => handleCollapse(id)}
                    className={` text-light-primary border sm:w-auto w-full h-[57px] px-4 rounded dark:bg-dark-primary border-light-primary dark:text-grey-dark text-2xl`}
                  >
                    All
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiquidityPools;

const ethlist = [
  { id: 1, icon: ethsm, value: "ETH" },
  { id: 2, icon: ethsm, value: "ETH" },
  { id: 3, icon: ethsm, value: "ETH" },
  { id: 4, icon: ethsm, value: "ETH" },
  { id: 5, icon: ethsm, value: "ETH" },
];
const modellist = [
  {
    id: 1,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: 670.03,
    liq: 670.03,
    rewards: 211.0,
  },
  {
    id: 2,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: 670.03,
    liq: 670.03,
    rewards: 211.0,
  },
  {
    id: 3,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: 670.03,
    liq: 670.03,
    rewards: 211.0,
  },
  {
    id: 4,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: 670.03,
    liq: 670.03,
    rewards: 211.0,
  },
  {
    id: 5,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: 670.03,
    liq: 670.03,
    rewards: 211.0,
  },
];
