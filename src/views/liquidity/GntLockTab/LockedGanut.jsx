import React from "react";

const LockedGanut = () => {
  return (
    <div className="pb-8">
      <div className="p-5 text-light-primary  dark:text-grey-dark text-22 dark:bg-dark-primary flex md:flex-row flex-col gap-y-4">
        <div className="flex-1 flex justify-between items-center">
          <p className="">Locked Ganut</p>
          <p className="text-xl md:mr-10 ">
            177% <span className="text-grey-dark dark:text-white">APR</span>
          </p>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <div className="border text-light-primary w-full flex justify-between items-center px-4 dark:text-grey-dark border-grey-dark flex-[2] md:max-w-[216px] h-[49px]">
            <span className="text-[13px] ">Deposit ()</span>
            <span className="text-xl">0.0</span>
          </div>{" "}
          <button
            style={{ height: 49 }}
            className="text-lg flex-1 sm:max-w-[148px] w-full py-2 font-bold bg-light-primary text-off-white "
          >
            Claim
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center py-3 px-5">
          <div className="flex-1">
            <p className="text-light-primary dark:text-grey-dark">Amount</p>
          </div>
          <div className="flex-1">
            {" "}
            <p className="text-light-primary dark:text-grey-dark">
              Expire Data
            </p>
          </div>
        </div>
        <hr className="border-grey-dark" />

        {tableData.map((data) => {
          const { apr, date } = data;
          return (
            <div className="flex items-center px-5 py-6 text-light-primary dark:text-grey-dark ">
              <div className="flex-1">
                <p className="text-xl md:mr-10 ">
                  {apr} <span className="text-grey-dark">APR</span>
                </p>{" "}
              </div>
              <div className="flex-1">
                {" "}
                <p className="text-grey-dark">{date}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 bg-light-primary dark:bg-off-white dark:bg-opacity-10 text-white h-[64px] flex items-center w-full">
        Total Locked: GNT: 980 ($3812){" "}
      </div>
    </div>
  );
};

export default LockedGanut;

const tableData = [
  { id: 1, apr: "177%", date: "18.10.2021" },
  { id: 2, apr: "177%", date: "18.13.2021" },
  { id: 3, apr: "177%", date: "18.16.2021" },
  { id: 4, apr: "177%", date: "18.20.2021" },
  { id: 5, apr: "177%", date: "18.30.2021" },
];
