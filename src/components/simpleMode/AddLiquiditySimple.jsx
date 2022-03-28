import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { BsPlus } from "react-icons/bs";
import Select from "@mui/material/Select";
import Button from '@mui/material/Button';
import btc from "../../images/crypto/btc.svg";
import eth from "../../images/crypto/eth.svg";
import Slider from "@mui/material/Slider";
import Modal from "@mui/material/Modal";
import tw from "twin.macro";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const AddLiquiditySimple = () => {
  const [crypto, setCrypto] = useState("");
  const [ratio, setRatio] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [value, setValue] = useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [sliderValue, setSliderValue] = React.useState(50);

  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
  };
  const handleOpen = (val) => {
    setSelected(val);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setCrypto(event.target.value);
  };

  const handleValueEth = (event) => {
    setValueEth(event.target.value);
  };

  const handleValue = (event) => {
    setValue(event.target.value);
  };

  const StyledModal = tw.div`
  flex
  flex-col
  absolute
  top-1/4 left-1/3
  bg-white-bg
  p-6
  shadow-box overflow-y-scroll
  min-h-min
  transform -translate-x-1/2 -translate-y-1/2
  w-1/3
  `;
  return (
    <div className="bg-white-bg dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
      <h3 className="model-title mb-4">Add Liquidity </h3>
      <div className=" flex justify-between">
        <p className="capitalize text-grey-dark">Ratio 50% BTC - 50% ETH</p>
        <button
          onClick={() => setRatio(!ratio)}
          className="capitalize text-light-primary dark:text-grey-dark"
        >
          Change Ratio %
        </button>
      </div>
      {ratio && (
        <div className="my-4">
          <div className="text-light-primary mb-5 dark:text-grey-dark text-base capitalize ">
            ratio
          </div>
          <Slider
            size="small"
            value={sliderValue}
            onChange={handleSlider}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
          <div className="flex">
            <button
              style={{ fontSize: 12, fontWeight: 400, minHeight: 32 }}
              className="flex-1 btn-primary"
            >
              {sliderValue}% BTC
            </button>
            <button
              style={{
                fontSize: 12,
                fontWeight: 400,
                background: "#fafafa",
                minHeight: 32,
              }}
              className="flex-1 btn-primary "
            >
              <span className="text-light-primary dark:text-grey-dark">
                {100 - sliderValue}% ETH
              </span>
            </button>
          </div>
        </div>
      )}

      <hr className="my-4" />

      <div className="w-full flex flex-col gap-y-6">
        <div>
          <h3 className="input-lable mb-4">Input</h3>
          <div className="flex flex-wrap sm:flex-row flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
            <div className="flex-1">
              <Button variant="outlined" startIcon={<img src={btc} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(0)}>
                BTC
              </Button>
            </div>
            <div className="text-right flex-1">
              <form>
                <input
                  type="number"
                  value={value}
                  onChange={handleValue}
                  className="input-value max-w-[300px] sm:max-w-none w-full text-right bg-transparent focus:outline-none"
                ></input>
              </form>
              <p className="text-base text-grey-dark">Balance: 0.10202 ETH</p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center text-light-primary text-2xl dark:text-grey-dark">
          <BsPlus />
        </div>

        <div>
          <h3 className="input-lable mb-4">Input</h3>
          <div className="flex flex-wrap sm:flex-row flex-col justify-between sm:items-center  rounded-sm p-2 sm:p-4 bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
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
                  className="input-value text-right max-w-[300px] sm:max-w-none w-full bg-transparent focus:outline-none"
                ></input>
              </form>
              <p className="text-base text-grey-dark">Balance: 0.10202 ETH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <button
          onClick={handleOpen}
          style={{ minHeight: 57 }}
          className="btn-primary font-bold w-full dark:text-dark-primary"
        >
          {" "}
          confirm{" "}
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
                  style: {color: '#333'}
                }}
                InputLabelProps={{
                  style: { color: '#333' },
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
  );
};

export default AddLiquiditySimple;

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
