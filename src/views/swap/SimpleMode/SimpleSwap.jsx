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
import { getTokenBalance, getPoolAddress, getPoolData, swapTokens, tokenApproval, approveToken } from "../../../config/web3";
import { uniList }  from "../../../config/constants";
import {AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip} from 'recharts';

import './SimpleSwap.css'


const SimpleSwap = () => {

  const { account, connector } = useWeb3React();
  const [value, setValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [poolAddress, setPoolAddress] = useState('');
  const [inToken, setInToken] = useState(uniList[0]);
  const [outToken, setOutToken] = useState(uniList[1]);
  const [inBal, setInBal] = useState(0);
  const [outBal, setOutBal] = useState(0);
  const [chartOpen, setChartOpen] = useState(false);
  const [approval, setApproval] = useState(false);
  const [filterData, setFilterData] = useState(uniList);

  const chartData = [
        {name:"0", x:0.5, y:0.5},
        {name:"1", x:0.4, y:0.6},
        {name:"2", x:0.45, y:0.55},
        {name:"3", x:0.52, y:0.48},
        {name:"4", x:0.44, y:0.56},
        {name:"5", x:0.37, y:0.63},
        {name:"6", x:0.64, y:0.36}
    ];

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

  const handleOpen = (val) => {
    setSelected(val);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleValue = async (event) => {
    setValue(event.target.value);
    const provider = await connector.getProvider();
    const poolData = await getPoolData(provider, poolAddress);
    const amountOut = await calculateSwap(inToken, poolData, event.target.value);
    setValueEth(amountOut.toPrecision(6));
    checkApproved(event.target.value);
  };

  const checkApproved = async (val) => {
    const provider = await connector.getProvider();
    const approval = await tokenApproval(account,  provider, inToken['address']);
    setApproval(approval*1 > val*1);
  }

  const calculateSwap = async (inToken, poolData, input) => {

    let ammount = input * 10 ** 18;
    
    let balance_from;
    let balance_to;
    let weight_from;
    let weight_to;
    
    if (inToken['address'] == poolData.tokens[0]){
        balance_from = poolData.balances[0];
        balance_to = poolData.balances[1];
        weight_from = poolData.weights[0];
        weight_to = poolData.weights[1];
    }
    else{
        balance_from = poolData.balances[1];
        balance_to = poolData.balances[0];
        weight_from = poolData.weights[1];
        weight_to = poolData.weights[0];
    }

    
    let bIn = ammount / (10 ** 18);
    let pbA = balance_to / (10 ** 18);
    let pbB = balance_from / (10 ** 18);
    let wA = weight_to / (10 ** 18);
    let wB = weight_from / (10 ** 18);

    let exp = (wB - wB * (1 - pbB / (pbB + bIn)) / (1 + pbB / (pbB + bIn))) / (wA + wB * (1 - pbB / (pbB + bIn)) / (1 + pbB / (pbB + bIn)));
    let bOut = pbA * (1 - (pbB / (pbB + bIn)) ** exp);
    
    return bOut;
  }

  const selectToken = async (token, selected) => {
    handleClose()

    var bal = 0;
    if(account)
      bal = await getTokenBalance(token['address'], account);
    if(selected == 0){
      setInBal(bal);
      let tempData = uniList.filter((item) => {
        return item['address'] !== token['address']
      });
      setFilterData(tempData);
      setInToken(token);

      checkApproved(value);
    } else if (selected == 1) {
      setOutBal(bal);
      let tempData = uniList.filter((item) => {
        return item['address'] !== token['address']
      });

      setFilterData(tempData);
      setOutToken(token);
    }
  }

  const executeSwap = async () => {
    if(account && inToken['address'] !== outToken['address']) {
      const limit = valueEth*0.99;
      const provider = await connector.getProvider();
      await swapTokens(provider, inToken['address'], outToken['address'], value*1, account, limit);
    }
  }

  const approveTk = async () => {
    if(account) {
      const provider = await connector.getProvider();
      const approvedToken = await approveToken(account, provider, inToken['address'], value);
      setApproval(approvedToken > value);
    }
  }

  useEffect(() => {
    if(account) {
      const getInfo = async () => {
        let inBal = await getTokenBalance(inToken['address'], account);
        let outBal = await getTokenBalance(outToken['address'], account);
        setInBal(inBal);
        setOutBal(outBal);
        checkApproved(value);
      }
      getInfo();
    }
  }, []);

  useEffect(() => {
    if(inToken !== outToken) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        const poolAddress = await getPoolAddress(inToken['address'], outToken['address']);
        const poolData = await getPoolData(provider, poolAddress);
        setPoolAddress(poolAddress);
        const amountOut = await calculateSwap(inToken, poolData, value);
        setValueEth(amountOut.toPrecision(6));
      }

      getInfo();
    }
  }, [inToken, outToken]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{backgroundColor:'white', padding:5}}>
          <p className="label fw-bold">Number: {label}</p>
          <p className="label">widgetA : {payload[0]['value']}</p>
          <p className="label">widgetB : {payload[1]['value']}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex sm:flex-row flex-col items-center">
      {chartOpen && (
        <div className="flex-1">
          <AreaChart width={500} height={500} data={chartData}>
            <CartesianGrid/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip  content={<CustomTooltip />} />
            <Area dataKey="x" stackId="1" 
                stroke="green" fill="green" />
            <Area dataKey="y" stackId="1" 
                stroke="blue" fill="blue" />
          </AreaChart>
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
                  <Button id="address_in" variant="outlined" startIcon={<img src={inToken['logoURL']} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(0)}>
                   {inToken['symbol']}
                  </Button>
                </div>
                <div className="text-right">
                  <form>
                    <input
                      type="number"
                      value={value}
                      min={0}
                      onChange={handleValue}
                      className="input-value text-lg text-right w-full bg-transparent focus:outline-none"
                    ></input>
                  </form>
                  <p className="text-base text-grey-dark">
                    Balance: {inBal}
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
                  <Button id="address_out" variant="outlined" startIcon={<img src={outToken['logoURL']} alt="abc" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(1)}>
                    {outToken['symbol']}
                  </Button>
                </div>
                <div className="text-right">
                  <form>
                    <input
                      type="number"
                      value={valueEth}
                      disabled
                      className="input-value w-full text-right bg-transparent focus:outline-none"
                    ></input>
                  </form>
                  <p className="text-base text-grey-dark">
                    Balance: {outBal}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <p className="text-grey-dark">Slippage 0.05%</p>
            <p className="text-light-primary">0.09 USDC</p>
          </div>

          <div className="mt-20 flex">
          {!approval &&
            <button
              onClick={approveTk}
              style={{ minHeight: 57,  }}
              className={approval?"btn-primary font-bold w-full dark:text-black flex-1":"btn-primary font-bold w-full dark:text-black flex-1 mr-2"}
            >
              {" "}
              Approval{" "}
            </button>
          }
            <button
              onClick={executeSwap}
              style={{ minHeight: 57 }}
              className={approval?"btn-primary font-bold w-full dark:text-black flex-1":"btn-primary font-bold w-full dark:text-black flex-1 ml-2"}
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
                    <li key={address} className="flex gap-x-1 thelist"  onClick={() => selectToken(item, selected)}>
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

};

export default SimpleSwap;
