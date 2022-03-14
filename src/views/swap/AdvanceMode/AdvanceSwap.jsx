import React, { useState } from "react";
import { ImLoop } from "react-icons/im";
import eth from "../../../images/crypto/ethlg.svg";
import btc from "../../../images/crypto/btclg.svg";
import { AiOutlineArrowRight, AiOutlineLineChart } from "react-icons/ai";
import SwapModal from "./SwapModal";

const AdvanceSwap = ({ handleMode }) => {
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState([]);
  const handleOpen = (d) => {
    setOpen(true);
    setModalData(d);
  };
  const handleClose = () => setOpen(false);
  return (
    <div>
      <div className="flex justify-end mb-4">
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

      <div className="pb-11">
        <div className="flex flex-col gap-y-6">
          {modellist.map((item) => {
            const { id, icon, btc, value, liq } = item;
            return (
              <div
                key={id}
                className=" p-6 dark:bg-off-white dark:bg-opacity-10 rounded border border-grey-dark "
              >
                <div className="flex md:items-center md:flex-row flex-col justify-between gap-y-4 flex-wrap ">
                  <div className="flex items-center gap-y-4 gap-x-9">
                    <div className="relative flex items-center gap-x-[10px] ">
                      <img src={icon} alt="" />
                      <span className="text-light-primary text-2xl dark:text-grey-dark">
                        <AiOutlineArrowRight />
                      </span>
                      <img className="" src={btc} alt="" />
                    </div>
                    <p className="text-light-primary text-xl dark:text-grey-dark">
                      {value}
                    </p>
                  </div>
                  <div className="flex items-center justify-center sm:justify-end flex-wrap  gap-x-4 gap-y-4 flex-grow  ">
                    <div className="w-full sm:w-auto">
                      <p className="list-title-small mb-1">24 Price Change</p>
                      <div className="list-value">{liq}</div>
                    </div>{" "}
                    <button
                      style={{ height: 64 }}
                      onClick={() => handleOpen(item)}
                      className="text-lg border border-light-primary bg-grey-dark  w-full sm:max-w-170 font-bold dark:text-grey-dark text-light-primary dark:bg-dark-primary rounded"
                    >
                      Swap
                    </button>
                    <button
                      className={`text-light-primary rounded dark:bg-dark-primary dark:text-grey-dark text-2xl`}
                    >
                      <span className="text-3xl">
                        <AiOutlineLineChart />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SwapModal open={open} close={handleClose} data={modalData} />
    </div>
  );
};

export default AdvanceSwap;

const modellist = [
  {
    id: 1,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: "0.01 + ",
    liq: "0.01 + ",
    rewards: 211.0,
  },
  {
    id: 2,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: "0.01 + ",
    liq: "0.01 + ",
    rewards: 211.0,
  },
  {
    id: 3,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: "0.01 + ",
    liq: "0.01 + ",
    rewards: 211.0,
  },
  {
    id: 4,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: "0.01 + ",
    liq: "0.01 + ",
    rewards: 211.0,
  },
  {
    id: 5,
    icon: eth,
    btc: btc,
    value: "BTC - ETH LP",
    apr: "0.01 + ",
    liq: "0.01 + ",
    rewards: 211.0,
  },
];
