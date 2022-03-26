import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import btc from "../../../images/crypto/btc.svg";
import eth from "../../../images/crypto/eth.svg";
import chart from "../../../images/chart.png";
import Button from '@mui/material/Button';
import Modal from "@mui/material/Modal";
import tw, { styled } from "twin.macro";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// import tw from "twin.macro";
import { AiOutlineArrowDown, AiOutlineLineChart } from "react-icons/ai";
import { ImLoop } from "react-icons/im";

const StyledModal = tw.div`
  flex
  flex-col
  absolute
  top-1/2 left-1/2
  bg-white-bg
  p-6
  shadow-box overflow-y-scroll
  min-h-min
  transform -translate-x-1/2 -translate-y-1/2
  w-1/4
  `;

const SimpleSwap = () => {
  const [crypto, setCrypto] = useState("");
  const [value, setValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [chartOpen, setChartOpen] = useState(false);

  const handleOpen = (val) => {
    setSelected(val);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleValueEth = (event) => {
    setValueEth(event.target.value);
  };
  const handleValue = (event) => {
    setValue(event.target.value);
  };
  const handleChange = (event) => {
    setCrypto(event.target.value);
  };

  return (
    <div className="flex sm:flex-row flex-col items-center">
      {chartOpen && (
        <div className="flex-1">
          <img src={chart} alt="chart" />
        </div>
      )}

      <div className="max-w-2xl mx-auto pb-16 flex-1">
        <div className="flex gap-x-8 justify-end mb-5">
          <button
            onClick={() => setChartOpen(!chartOpen)}
            className="flex text-light-primary gap-x-3 dark:text-grey-dark text-lg"
          >
            <p className="capitalize"> Chart</p>
            <span className="text-3xl">
              <AiOutlineLineChart />
            </span>
          </button>
        </div>
        <div className="bg-white-bg  dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
          <div className="w-full flex flex-col gap-y-6">
            <div>
              <h3 className="input-lable mb-4">Input</h3>
              <div className="flex flex-wrap sm:flex-row flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                <div>
                  <Button variant="outlined" startIcon={<img src={btc} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(0)}>
                    BTC
                  </Button>
                </div>
                <div className="text-right">
                  <form>
                    <input
                      type="number"
                      value={value}
                      onChange={handleValue}
                      className="input-value text-right w-full bg-transparent focus:outline-none"
                    ></input>
                  </form>
                  <p className="text-base text-grey-dark">
                    Balance: 0.10202 ETH
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center text-light-primary text-2xl dark:text-grey-dark">
              <AiOutlineArrowDown />
            </div>

            <div>
              <h3 className="input-lable mb-4">Output</h3>
              <div className="flex flex-wrap sm:flex-row flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                <div>
                  <Button variant="outlined" startIcon={<img src={eth} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(1)}>
                    ETH
                  </Button>
                </div>
                <div className="text-right">
                  <form>
                    <input
                      type="number"
                      value={valueEth}
                      onChange={handleValueEth}
                      className="input-value w-full text-right bg-transparent focus:outline-none"
                    ></input>
                  </form>
                  <p className="text-base text-grey-dark">
                    Balance: 0.10202 ETH
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <p className="text-grey-dark">Slippage 0.05%</p>
            <p className="text-light-primary">0.09 USDC</p>
          </div>

          <div className="mt-8">
            <button
              style={{ minHeight: 57 }}
              className="btn-primary font-bold w-full dark:text-dark-primary"
            >
              {" "}
              Swap{" "}
            </button>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <StyledModal>
              <h3 className="model-title mb-6">Select Token</h3>
              <Autocomplete
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
              <hr className="my-6" />
              {selected === 0 && 
                <ul className="flex flex-col gap-y-6">
                  {cryptolist.map((item) => {
                    const { id, icon, value } = item;
                    return (
                      <li key={id} className="flex gap-x-1">
                        <div className="relative flex">
                          <img src={icon} alt="" />
                        </div>
                        <p className="text-light-primary text-lg">{value}</p>
                      </li>
                    );
                  })}
                </ul>
              }
              {selected === 1 && 
                <ul className="flex flex-col gap-y-6">
                  {ethlist.map((item) => {
                    const { id, icon, value } = item;
                    return (
                      <li key={id} className="flex gap-x-1">
                        <div className="relative flex">
                          <img src={icon} alt="" />
                        </div>
                        <p className="text-light-primary text-lg">{value}</p>
                      </li>
                    );
                  })}
                </ul>
              }
            </StyledModal>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default SimpleSwap;

const cryptolist = [
  { id: 1, icon: btc, value: "BTC" },
  { id: 2, icon: btc, value: "BTC" },
  { id: 3, icon: btc, value: "BTC" },
  { id: 4, icon: btc, value: "BTC" },
  { id: 5, icon: btc, value: "BTC" },
];

const ethlist = [
  { id: 1, icon: eth, value: "ETH" },
  { id: 2, icon: eth, value: "ETH" },
  { id: 3, icon: eth, value: "ETH" },
  { id: 4, icon: eth, value: "ETH" },
  { id: 5, icon: eth, value: "ETH" },
];

// const StyledModal = tw.div`
//   flex
//   flex-col
//   absolute
//   top-1/2 left-1/2
//   bg-white-bg
//   max-w-sm
//   p-6
//   shadow-box overflow-y-scroll
//   min-h-min
//   transform -translate-x-1/2 -translate-y-1/2
//   `;
