import {
  Autocomplete,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { ImLoop } from "react-icons/im";
import eth from "../../images/crypto/ethlg.svg";
import ethsm from "../../images/crypto/eth.svg";
import btc from "../../images/crypto/btclg.svg";
import AddLiquidityModal from "./AddLiquidityModal";
import RemoveLiquidityModal from "./RemoveLiquidityModal";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const AddLiquidityAdvance = ({ handleMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sorted, setSorted] = useState("");
  const [modalData, setModalData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [secondModal, setSeconModal] = React.useState(false);
  const [collapse, setCollapse] = useState(0);

  // const [open, setOpen] = React.useState(false);

  const handleOpen = (d) => {
    setOpen(true);
    setModalData(d);
  };
  const handleClose = () => setOpen(false);

  const handleCollapse = (id) => {
    if (collapse === id) {
      setCollapse(!id);
    } else {
      setCollapse(id);
    }
  };
  const handleOpenRemoveLp = (d) => {
    setSeconModal(true);
    setModalData(d);
  };
  const handleCloseOpenRemoveLp = () => setSeconModal(false);

  const handleChange = (event) => {
    setSorted(event.target.value);
  };
  const handleDeposit = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <div className="py-8">
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
            {/* <div
              style={{ fontSize: "13px" }}
              label="sort-bye"
              className="text-light-primary capitalize dark:text-grey-dark"
            >
              {" "}
              sort by
            </div> */}
            <FormControl sx={{ width: "100%" }}>
              <Select
                sx={{ height: 56 }}
                value={sorted}
                onChange={handleChange}
                displayEmpty
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
          className="text-light-primary order-last ml-8 gap-x-4 flex items-center dark:text-grey-dark"
        >
          <p className="capitalize"> simple mode</p>
          <span className="text-2xl">
            <ImLoop />
          </span>
        </button>
      </div>

      <div className="py-8">
        <div className="flex flex-col gap-y-6">
          {modellist.map((item) => {
            const { id, icon, btc, value, apr, liq, rewards } = item;
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
                        onClick={() => handleOpen(item)}
                        className="bg-grey-dark text-lg w-full sm:max-w-170 font-bold dark:text-grey-dark text-light-primary dark:bg-dark-primary rounded"
                      >
                        Add LP
                      </button>
                    </div>
                    <button
                      onClick={() => handleCollapse(id)}
                      className={` text-light-primary dark:text-grey-dark text-2xl`}
                    >
                      {" "}
                      {collapse === id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                  </div>
                </div>

                <div
                  className={`${
                    collapse === id ? "open" : "collapse"
                  } flex justify-center  md:justify-end w-full`}
                >
                  <div className="py-6 gap-x-5 items-center flex-wrap gap-y-4 flex-1 justify-center sm:justify-end flex">
                    <div className="sm:max-w-170 w-full">
                      <p className="list-title-small">YOUR LP</p>
                      <div className="list-value">{liq}</div>
                    </div>
                    <div
                      style={{ minHeight: 57 }}
                      className="border sm:max-w-268 justify-between w-full flex border-grey-dark px-4 items-center"
                    >
                      <span className="list-title-small uppercase pl-2">
                        REWARDS{" "}
                      </span>
                      <span className="list-value">{rewards} </span>
                    </div>
                    <button
                      onClick={() => handleOpenRemoveLp(item)}
                      style={{ minHeight: 57 }}
                      className="border px-4 md:mr-10 border-light-primary sm:max-w-170 w-full rounded-md flex justify-center items-center text-light-primary dark:text-grey-dark dark:border-grey-dark"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddLiquidityModal data={modalData} open={open} close={handleClose} />

      <RemoveLiquidityModal
        data={modalData}
        open={secondModal}
        close={handleCloseOpenRemoveLp}
      />
    </div>
  );
};

export default AddLiquidityAdvance;

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
