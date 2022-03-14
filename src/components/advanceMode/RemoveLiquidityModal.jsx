import React, { useState } from "react";
import { Modal, Slider } from "@mui/material";
import tw from "twin.macro";

const RemoveLiquidityModal = ({ open, close, data }) => {
  const [ratio, setRatio] = useState(false);
  const { icon, btc, value } = data;
  const [sliderValue, setSliderValue] = React.useState(50);

  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
  };
  const StyledModal = tw.div`
  flex flex-col absolute top-1/2 left-1/2 bg-white-bg max-w-sm w-full p-6 shadow-box  min-h-min transform -translate-x-1/2 -translate-y-1/2
  `;
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
          <h3 className="model-title mb-4 ">Remove Liquidity </h3>
          <div className="colors flex justify-between">
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
            <div className="flex gap-x-3 w-full items-center justify-between">
              <div className="py-2 px-4 h-16 flex items-center border gap-x-3 rounded-md border-grey-dark">
                <div className="relative flex items-center">
                  <img className="w-8 h-8" src={icon} alt="" />
                  <img
                    className="z-10 relative right-2 w-8 h-8"
                    src={btc}
                    alt=""
                  />
                  <p className="text-light-primary text-base dark:text-grey-dark">
                    {value}
                  </p>
                </div>
              </div>
              <p className="list-title-small">Lp Tokens</p>
              <div className="list-value">5</div>
            </div>

            <div className=" w-full">
              <div className="text-light-primary dark:text-grey-dark text-base capitalize ">
                LP Amount
              </div>
              <Slider
                size="small"
                defaultValue={50}
                aria-label="Small"
                valueLabelDisplay="auto"
              />
              <hr className="mb-4 text-grey-dark" />
            </div>
            <div className="flex flex-col gap-y-4 mb-4 w-full">
              <div className="flex justify-between">
                <div className="text-base  text-grey-dark">Recieve ETH</div>
                <div className="text-base text-light-primary dark:text-grey-dark ">
                  1.00000
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-base  text-grey-dark">Recieve BTC</div>
                <div className="text-base text-light-primary dark:text-grey-dark ">
                  1.00000
                </div>
              </div>
            </div>

            <button
              style={{ minHeight: 57 }}
              className="btn-primary font-bold rounded w-full"
            >
              confirm and remove LP
            </button>
          </div>
        </StyledModal>
      </Modal>
    </div>
  );
};

export default RemoveLiquidityModal;
