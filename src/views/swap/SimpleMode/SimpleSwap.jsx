import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
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
import { getTokenBalance, getPoolAddress, getPoolData } from "../../../config/web3.js";

import './SimpleSwap.css'

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

let img_in = "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ";
let img_out = "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe";


const SimpleSwap = () => {

  const { account } = useWeb3React();

  const [crypto, setCrypto] = useState("");
  const [value, setValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [inToken, setInToken] = useState('BTC');
  const [outToken, setOutToken] = useState('TETH');
  const [inVal, setInVal] = useState(0);
  const [outVal, setOutVal] = useState(0);
  const [chartOpen, setChartOpen] = useState(false);
  const [filterData, setFilterData] = useState(uniList);

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

  useEffect(() => {
    if(account) {
      const getInfo = async () => {
        let inVal = await getTokenBalance(inToken.toLowerCase(), account);
        let outVal = await getTokenBalance(outToken.toLowerCase(), account);
        debugger;
        setInVal(inVal);
        setOutVal(outVal);
      }
      getInfo();
    }
  }, []);

  useEffect(() => {
    if(inToken !== outToken) {
      const getInfo = async () => {
        const poolAddress = await getPoolAddress(inToken.toLowerCase(), outToken.toLowerCase());
        const poolData = await getPoolData(poolAddress);
        console.log(poolData);
      }

      getInfo();
    }
  }, [inToken, outToken]);

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
                  <Button id="address_in" variant="outlined" startIcon={<img src={img_in} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(0)}>
                   {inToken}
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
                    Balance: {inVal}
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
                  <Button id="address_out" variant="outlined" startIcon={<img src={img_out} alt="abc" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(1)}>
                    {outToken}
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
                    Balance: {outVal}
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
                options={filterData.map((option) => option.value)}
                className="input-value"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    className="input-value"
                    InputProps={{
                      type: "search",
                      className: 'input-value',
                      style: {color: '#333'}
                    }}
                    InputLabelProps={{
                      style: { color: '#333' },
                    }}
                  />
                )}
              />
              <hr className="my-6" />
              <ul className="flex flex-col gap-y-2">
                {filterData.map((item) => {
                  const { address, logoURL, symbol} = item;
                  return (
                    <li key={address} className="flex gap-x-1 thelist"  onClick={() => selectToken({address},symbol ,logoURL, selected)}>
                      <div className="relative flex">
                        <img src={logoURL} alt="" />
                      </div>
                      <p className="text-light-primary text-lg">{symbol}</p>
                    </li>
                  );
                })}
              </ul>
            </StyledModal>
          </Modal>
        </div>
      </div>
    </div>
  );

  async function selectToken(address, value , url, selected){
    handleClose()

    var bal = 0;
    if(account)
      bal = await getTokenBalance(value.toLowerCase(), account);
    if(selected == 0){
    setInVal(bal);
    let tempData = uniList.filter((item) => {
      return item['address'] !== address['address']
    });

    setFilterData(tempData);

      token_In = address;
      img_in = url;
      setInToken(value);
    } else if (selected == 1) {
      setOutVal(bal);
      let tempData = uniList.filter((item) => {
        return item['address'] !== address['address']
      });

      setFilterData(tempData);
      token_Out = address;
      img_out = url;
      setOutToken(value);
    }
  }

};

export default SimpleSwap;

let token_In
let token_Out

const uniList = [
  {value: "some", chainId: 3, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "tETH", name: "tETH Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmXtWNMhcz6myKn2acQLvhfSzUc3CEB17uTaS8NKSm9fPe", tags: ["stablecoin"]},
  {value: "other", chainId: 3, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "https://gateway.pinata.cloud/ipfs/QmZ5Fu4uwjENpbLRGs1eDrYHM5JMXQjSD3gkAi8bW63riJ", tags: ["stablecoin"]},
  { }
]
