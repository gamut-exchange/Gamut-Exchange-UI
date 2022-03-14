import React from "react";
import { VscLock } from "react-icons/vsc";

const GntClaim = () => {
  return (
    <div>
      <div className="flex flex-col gap-y-4 my-10 ">
        <div className="px-9 w-full py-5  md:flex-row flex-col border border-grey-dark rounded flex items-center text-light-primary dark:bg-off-white dark:bg-opacity-10">
          <div className="flex-1 w-full">
            <p className="text-22">GNT Rewards </p>
          </div>
          <div className="flex-1 w-full md:flex-row flex-col gap-y-4 md:items-center flex justify-between">
            <p className="text-lg md:ml-10">
              4870 <span className="text-grey-dark">GNT</span>
            </p>
            <button
              style={{ height: 46 }}
              className="text-lg sm:max-w-[148px] w-full py-2 font-bold bg-light-primary text-off-white "
            >
              Claim
            </button>
          </div>
        </div>

        <div className="px-9 w-full py-5  md:flex-row flex-col  border border-grey-dark rounded flex items-center text-light-primary dark:bg-off-white dark:bg-opacity-10">
          <div className="flex-1 w-full">
            <p className="text-22">GNT Unlocked</p>
          </div>
          <div className="flex-1 w-full md:flex-row flex-col gap-y-4 md:items-center flex justify-between">
            <p className="text-lg md:ml-10">
              4870 <span className="text-grey-dark">GNT</span>
            </p>
            <button
              style={{ height: 46 }}
              className="text-lg sm:max-w-[148px] w-full py-2 font-bold bg-light-primary text-off-white "
            >
              Unstake
            </button>
          </div>
        </div>
      </div>
      <div className="bg-light-primary dark:bg-off-white dark:bg-opacity-10 gap-x-7 text-white py-5 px-6 w-full flex">
        <div className=" text-6xl">
          <VscLock />
        </div>
        <p className="max-w-[549px]">
          Lock your GNT tokens for 3 months to recieve fres drieeve from the
          early claim function for liquidity providers. Leave your unlocked GNT
          staked to continously recieve fees{" "}
        </p>
      </div>
    </div>
  );
};

export default GntClaim;
