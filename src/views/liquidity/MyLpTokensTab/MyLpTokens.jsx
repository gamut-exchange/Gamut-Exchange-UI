import React from "react";
import eth from "../../../images/crypto/ethlg.svg";
import btc from "../../../images/crypto/btclg.svg";

const MyLpTokens = () => {
  return (
    <div className="pb-11">
      <div className="flex flex-col gap-y-6">
        {modellist.map((item) => {
          const { id, icon, btc, value,  liq,  } = item;
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
                <div className="flex items-center lg:max-w-[600px] justify-center flex-wrap  gap-x-4 gap-y-4 w-full ">
                  <div className="flex-1 md:block hidden"></div>
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
                  {/* <button
                    onClick={() => handleCollapse(id)}
                    className={` text-light-primary border sm:w-auto w-full h-[57px] px-4 rounded dark:bg-dark-primary border-light-primary dark:text-grey-dark text-2xl`}
                  >
                    All
                  </button> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyLpTokens;
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
