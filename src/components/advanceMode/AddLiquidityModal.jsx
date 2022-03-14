import React, { useState } from "react";
import { MenuItem, Modal, Select, Slider } from "@mui/material";
import tw from "twin.macro";
import btc from "../../images/crypto/btc.svg";
import FormControl from "@mui/material/FormControl";

const AddLiquidityModal = ({ open, close, data }) => {
  const [ratio, setRatio] = useState(false);
  const { btc } = data;
  const [crypto, setCrypto] = useState("");
  const [sliderValue, setSliderValue] = useState(50);
  const [value, setValue] = useState(0);
  const [valueEth, setValueEth] = useState(0);

  const handleChange = (event) => {
    setCrypto(event.target.value);
  };
  const handleValueEth = (event) => {
    setValueEth(event.target.value);
  };
  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
  };
  const handleValue = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ padding: 1 }}
      >
        <StyledModal>
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
              <div className="text-light-primary dark:text-grey-dark text-base capitalize ">
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

          <div className="flex  flex-col items-center gap-y-4">
            <div className="flex gap-x-4 w-full items-center justify-between">
              <FormControl sx={{ maxWidth: 146 }}>
                <Select
                  sx={{ maxHeight: 64 }}
                  value={crypto}
                  onChange={handleChange}
                  displayEmpty
                  className="bg-white-bg dark:bg-dark-primary"
                >
                  <MenuItem value="">
                    <em>
                      <div className="flex gap-x-4 items-center">
                        <img className="w-[48px] h-[48px]" src={btc} alt="" />
                        <p className="text-light-primary uppercase dark:text-grey-dark">
                          btc
                        </p>
                      </div>
                    </em>
                  </MenuItem>
                  {cryptolist.map((list) => {
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
              <p className="list-title-small">Deposit</p>
              <div className="list-value  ">
                <form className="">
                  <input
                    type="number"
                    value={value}
                    onChange={handleValue}
                    className=" text-right max-w-[80px] bg-transparent focus:outline-none"
                  ></input>
                </form>
              </div>
            </div>

            <p className="text-grey-dark capitalize  font-semibold text-xs">
              pair with +
            </p>

            <div className="flex gap-x-4 w-full pr-4 items-center justify-between rounded-md bg-grey-dark">
              <FormControl sx={{ maxWidth: 146 }}>
                <Select
                  sx={{ maxHeight: 64 }}
                  value={crypto}
                  onChange={handleChange}
                  displayEmpty
                  className="bg-transparent border-none focus:outline-none dark:bg-dark-primary"
                >
                  <MenuItem value="">
                    <em>
                      <div className="flex gap-x-4 items-center">
                        <img className="w-[48px] h-[48px]" src={btc} alt="" />
                        <p className="text-light-primary uppercase dark:text-grey-dark">
                          btc
                        </p>
                      </div>
                    </em>
                  </MenuItem>
                  {cryptolist.map((list) => {
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
              <p className="list-title-small">Deposit</p>
              <div className="list-value">
                <form>
                  <input
                    type="number"
                    value={valueEth}
                    onChange={handleValueEth}
                    className="text-right bg-transparent max-w-[80px] focus:outline-none"
                  ></input>
                </form>
              </div>
            </div>

            <button
              style={{ minHeight: 57 }}
              className="btn-primary font-bold rounded w-full"
            >
              confirm and add LP
            </button>
          </div>
        </StyledModal>
      </Modal>
    </div>
  );
};

export default AddLiquidityModal;

const cryptolist = [
  { id: 1, icon: btc, value: "BTC" },
  { id: 2, icon: btc, value: "BTC" },
  { id: 3, icon: btc, value: "BTC" },
  { id: 4, icon: btc, value: "BTC" },
  { id: 5, icon: btc, value: "BTC" },
];

const StyledModal = tw.div`
flex
flex-col
absolute
top-1/2 left-1/2
bg-white-bg
max-w-sm w-full
p-6
shadow-box 
min-h-min
transform -translate-x-1/2 -translate-y-1/2
`;
