import React from "react";

const ClaimAll = () => {
  return (
    <div>
      <div className="flex flex-col my-10 border border-grey-dark rounded">
        <div className="px-9 w-full py-5 border-b md:flex-row flex-col border-grey-dark flex items-center text-light-primary dark:text-grey-dark dark:bg-off-white dark:bg-opacity-10">
          <div className="flex-1 w-full">
            <p className="text-22">Unlock Ganut</p>
          </div>
          <div className="flex-1 w-full md:flex-row flex-col gap-y-4 md:items-center flex justify-between">
            <p className="text-lg md:ml-10">53.5 GNT</p>
            <button
              style={{ height: 46 }}
              className="text-lg px-9 py-2 font-bold bg-light-primary text-off-white "
            >
              Claim All
            </button>
          </div>
        </div>

        <div className="px-9 w-full py-5 border-b md:flex-row flex-col border-grey-dark flex items-center text-light-primary dark:text-grey-dark dark:bg-off-white dark:bg-opacity-10">
          <div className="flex-1 w-full">
            <p className="text-22">Granut in Vesting</p>
          </div>
          <div className="flex-1 w-full md:flex-row flex-col gap-y-4 md:items-center flex justify-between">
            <p className="text-lg md:ml-10">71 GNT</p>
            <button
              style={{ height: 46 }}
              className="text-lg px-9 py-2 font-bold bg-light-primary text-off-white "
            >
              Claim All
            </button>
          </div>
        </div>

        <div className="px-9 w-full py-5 border-b md:flex-row flex-col border-grey-dark flex items-center text-light-primary dark:text-grey-dark dark:bg-off-white dark:bg-opacity-10">
          <div className="flex-1 w-full">
            <p className="text-22">All Ganut after fee </p>
          </div>
          <div className="flex-1 w-full md:flex-row flex-col gap-y-4 md:items-center flex justify-between">
            <p className="text-lg md:ml-10">53.5 GNT</p>
            <button
              style={{ height: 46 }}
              className="text-lg px-9 py-2 font-bold bg-light-primary text-off-white "
            >
              Claim All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimAll;
