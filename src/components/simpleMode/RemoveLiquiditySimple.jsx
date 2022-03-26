import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import eth from "../../images/crypto/eth.svg";
import btc from "../../images/crypto/btc.svg";
import Slider from "@mui/material/Slider";
import Modal from "@mui/material/Modal";
import Button from '@mui/material/Button';
import tw from "twin.macro";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const RemoveLiquiditySimple = () => {
  const [crypto, setCrypto] = useState("");
  const [ratio, setRatio] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(50);
  const [value, setValue] = useState(0);
  const handleValue = (event) => {
    setValue(event.target.value);
  };

  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event) => {
    setCrypto(event.target.value);
  };

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

  return (
    <div className="bg-white-bg dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
      <h3 className="model-title mb-4">Remove Liquidity </h3>
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
          <div className="flex justify-between sm:flex-row flex-col gap-y-8 items-center p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
            <div className="flex-1 w-full">
            <Button variant="outlined" startIcon={<img src={eth} alt="" />} style={{padding:'10px 15px'}} onClick={handleOpen} css={[tw`bg-white dark:bg-black`]}>
              ETH
            </Button>
            </div>
            <div className="sm:text-right text-left flex-1 w-full">
              {" "}
              <form>
                <input
                  type="number"
                  value={value}
                  onChange={handleValue}
                  className="input-value text-right max-w-[80px] bg-transparent focus:outline-none"
                ></input>
              </form>
              <p className="text-base text-grey-dark">LP Balance: </p>
            </div>
          </div>

          <div className="my-4">
            <div className="text-light-primary mb-5 dark:text-grey-dark text-base capitalize ">
              LP Amount
            </div>
            <Slider
              size="small"
              defaultValue={50}
              aria-label="Small"
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      </div>

      <hr className="mb-4" />
      <div className="flex flex-col gap-y-4 mb-4">
        <div className="flex">
          <div className="text-base w-1/2 md:w-2/5 text-grey-dark">
            Recieve ETH
          </div>
          <div className="text-base text-light-primary dark:text-grey-dark flex-1">
            1.00000
          </div>
        </div>
        <div className="flex">
          <div className="text-base w-1/2 md:w-2/5 text-grey-dark">
            Recieve BTC
          </div>
          <div className="text-base text-light-primary dark:text-grey-dark flex-1">
            1.00000
          </div>
        </div>
      </div>
      <div className="">
        <button
          onClick={handleOpen}
          style={{ minHeight: 57 }}
          className="btn-primary rounded-sm font-bold w-full dark:text-dark-primary"
        >
          confirm
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledModal>
          <h3 className="model-title mb-6">Remove Liquidity</h3>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={modellist.map((option) => option.value)}
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
          <ul className="flex flex-col gap-y-6">
            {modellist.map((item) => {
              const { id, icon, btc, value } = item;
              return (
                <li key={id} className="flex gap-x-1">
                  <div className="relative flex">
                    <img src={icon} alt="" />
                    <img className="z-10 relative right-2" src={btc} alt="" />
                  </div>
                  <p className="text-light-primary text-lg">{value}</p>
                </li>
              );
            })}
          </ul>
        </StyledModal>
      </Modal>
    </div>
  );
};

export default RemoveLiquiditySimple;

const ethlist = [
  { id: 1, icon: eth, value: "BTC" },
  { id: 2, icon: eth, value: "BTC" },
  { id: 3, icon: eth, value: "BTC" },
  { id: 4, icon: eth, value: "BTC" },
  { id: 5, icon: eth, value: "BTC" },
];

const modellist = [
  { id: 1, icon: eth, btc: btc, value: "BTC - ETH LP" },
  { id: 2, icon: eth, btc: btc, value: "BTC - ETH LP" },
  { id: 3, icon: eth, btc: btc, value: "BTC - ETH LP" },
  { id: 4, icon: eth, btc: btc, value: "BTC - ETH LP" },
  { id: 5, icon: eth, btc: btc, value: "BTC - ETH LP" },
];
