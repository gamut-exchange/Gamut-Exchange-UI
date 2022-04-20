import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
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
import { getTokenBalance, getPoolAddress, getPoolData, swapTokens, batchSwapTokens, tokenApproval, approveToken, getSwapFeePercent } from "../../../config/web3";
import { uniList }  from "../../../config/constants";
import { poolList }  from "../../../config/constants";
import {AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip} from 'recharts';

import './SimpleSwap.css'


const SimpleSwap = ({dark}) => {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [chain, setChain] = useState(selected_chain);
  const [value, setValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [query, setQuery] = useState("");
  const [valueEth, setValueEth] = useState(0);
  const [poolAddress, setPoolAddress] = useState('');
  const [inToken, setInToken] = useState(uniList[selected_chain][0]);
  const [outToken, setOutToken] = useState(uniList[selected_chain][1]);
  const [inBal, setInBal] = useState(0);
  const [outBal, setOutBal] = useState(0);
  const [valSlipage, setValSlipage] = useState(0);
  const [fee, setFee] = useState(0);
  const [chartOpen, setChartOpen] = useState(false);
  const [approval, setApproval] = useState(false);
  const [filterData, setFilterData] = useState(uniList[selected_chain]);
  const [limitedout, setLimitedout] = useState(false);
  const [swapFee, setSwapFee] = useState(0);
  const [middleToken, setMiddleToken] = useState(null);
  const [middleTokenSymbol, setMiddleTokenSymbol] = useState('');

  const dispatch = useDispatch();

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
    let inLimBal = inBal.replaceAll(',', '');
    let outLimBal = outBal.replaceAll(',', '');
    if(Number(event.target.value) < inLimBal)
      setLimitedout(false);
    else
      setLimitedout(true);
    setValue(event.target.value);
    try {
        const provider = await connector.getProvider();
        if(middleToken) {
          const amountOut = await calcOutput(middleToken, provider, Number(event.target.value), inToken, outToken);
          // const slippage = await calcSlippage(inToken, poolData, event.target.value, amountOut);
          // setValSlipage('unknown');
          setValueEth(amountOut.toPrecision(6));
        } else {
          const poolAddress = await getPoolAddress(provider, inToken['address'], outToken['address'], chain);
          const poolData = await getPoolData(provider, poolAddress, chain);
          const amountOut = await calculateSwap(inToken, poolData, event.target.value);
          const slippage = await calcSlippage(inToken, poolData, event.target.value, amountOut);
          setValSlipage(slippage.toPrecision(2));
          setValueEth(amountOut.toPrecision(6));
        }
        setFee((event.target.value * 0.001).toPrecision(2));
    } catch (error) {

    }
    checkApproved(inToken, event.target.value);
  };

  const filterToken = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if(search_qr.length != 0) {
      const filterDT = uniList[chain].filter((item) => {
        return item['symbol'].toLowerCase().indexOf(search_qr) != -1
      });
      setFilterData(filterDT);
    } else {
      setFilterData(uniList[chain]);
    }
  }

  const checkApproved = async (token, val) => {
    const provider = await connector.getProvider();
    const approval = await tokenApproval(account,  provider, token['address'], chain);
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

  const calcSlippage = async (inToken, poolData, input, output) => {

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

    let pricePool = (balance_from/weight_from) / (balance_to/weight_to);
    let priceTrade = input/output;

    let slip = (1- pricePool/priceTrade) * 100;

    return slip;
  }

  const selectToken = async (token, selected) => {
    handleClose()
    var bal = 0;
    if(account) {
      const provider = await connector.getProvider();
      bal = await getTokenBalance(provider, token['address'], account);
      if(selected == 0) {
        setInBal(bal);
        let tempData = uniList[chain].filter((item) => {
          return item['address'] !== token['address']
        });
        setFilterData(tempData);
        setInToken(token);
        checkApproved(token, value);

        if(inToken !== token)
          await findMiddleToken(token, outToken);
        else
          setMiddleToken(null);

        let inLimBal = bal.replaceAll(',', '');
        let outLimBal = outBal.replaceAll(',', '');
        if(Number(value) <= Number(inLimBal) && Number(valueEth) <= Number(outLimBal))
          setLimitedout(false);
        else
          setLimitedout(true);

      } else if (selected == 1) {
        setOutBal(bal);
        let tempData = uniList[chain].filter((item) => {
          return item['address'] !== token['address']
        });

        setFilterData(tempData);
        setOutToken(token);
        if(inToken !== token)
          await findMiddleToken(inToken, token);
        else
          setMiddleToken(null);
      }
    }
  }

  const reverseToken = async () => {
    let tempToken = inToken;
    await selectToken(outToken, 0);
    await selectToken(tempToken, 1);
  }

  const calcOutput = async (middleTokens, provider, val=value, inSToken=inToken, outSToken=outToken) => {
      try {
          if(middleTokens.length === 1) {
            const poolAddressA = await getPoolAddress(provider, inSToken['address'], middleTokens[0]['address'], chain);
            const poolDataA = await getPoolData(provider, poolAddressA, chain);
            const poolAddressB = await getPoolAddress(provider, middleTokens[0]['address'], outSToken['address'], chain);
            const poolDataB = await getPoolData(provider, poolAddressB, chain);
            const middleOutput = await calculateSwap(inSToken['address'], poolDataA, val*(1-swapFee));
            const output = await calculateSwap(middleTokens[0]['address'], poolDataB, middleOutput*(1-swapFee));
            return output;
          } else {
            const poolAddressA = await getPoolAddress(provider, inSToken['address'], middleTokens[0]['address'], chain);
            const poolDataA = await getPoolData(provider, poolAddressA, chain);
            const poolAddressB = await getPoolAddress(provider, middleTokens[0]['address'], middleTokens[1]['address'], chain);
            const poolDataB = await getPoolData(provider, poolAddressB, chain);
            const poolAddressC = await getPoolAddress(provider, middleTokens[1]['address'], outSToken['address'], chain);
            const poolDataC = await getPoolData(provider, poolAddressC, chain);
            const middleOutput1 = await calculateSwap(inSToken['address'], poolDataA, val*(1-swapFee));
            const middleOutput2 = await calculateSwap(middleTokens[0]['address'], poolDataB, middleOutput1*(1-swapFee));
            const output = await calculateSwap(middleTokens[1]['address'], poolDataC, middleOutput2*(1-swapFee));
            return output;
          }
      } catch (error) {
        return -1;
      }
  }

  const findMiddleToken = async (inSToken, outSToken) => {
      const availableLists = uniList[chain].filter(item => {
          return (item['address'] !== inSToken['address'] && item['address'] !== outSToken['address']);
      });

      let suitableRouter = [];
      const provider = await connector.getProvider();
      for(let i=0; i<availableLists.length; i++) {
        const calculatedOutput = await calcOutput([availableLists[i]], provider, value, inSToken, outSToken);
        if(suitableRouter.length === 0) {
          if(Number(calculatedOutput) > 0) {
              suitableRouter[0] = [availableLists[i]];
              suitableRouter[1] = calculatedOutput;
          }
        } else {
          if(Number(calculatedOutput) > Number(suitableRouter[1])) {
            suitableRouter[0] = [availableLists[i]];
            suitableRouter[1] = calculatedOutput;
          }
        }
      }

      const allPairs = pairs(availableLists);
      for(let i=0; i<allPairs.length; i++) {
        const calculatedOutput = await calcOutput(allPairs[i], provider, value, inSToken, outSToken);
        if(suitableRouter.length === 0) {
          if(Number(calculatedOutput) > 0) {
              suitableRouter[0] = allPairs[i];
              suitableRouter[1] = calculatedOutput;
          }
        } else {
          if(Number(calculatedOutput) > Number(suitableRouter[1])) {
            suitableRouter[0] = allPairs[i];
            suitableRouter[1] = calculatedOutput;
          }
        }
      }

      try {
          const poolAddress = await getPoolAddress(provider, inSToken['address'], outSToken['address'], chain);
          const poolData = await getPoolData(provider, poolAddress, chain);
          const result = await calculateSwap(inSToken['address'], poolData, value);
          debugger;
          if(suitableRouter.length !== 0) {
              if( Number(result) > Number(suitableRouter[1])) {
                setMiddleToken(null);
                getMiddleTokenSymbol(null);
              }
              else {
                setMiddleToken(suitableRouter[0]);
                getMiddleTokenSymbol(suitableRouter[0]);
              }
          } else {
            setMiddleToken(suitableRouter[0]);
            getMiddleTokenSymbol(suitableRouter[0]);
          }

      } catch(error) {
        if(suitableRouter.length !== 0) {
          setMiddleToken(suitableRouter[0]);
          getMiddleTokenSymbol(suitableRouter[0]);
        } else {
          console.log("Can't swap the tokens.");
        }
      }
  }

  const pairs = (arr) => {   
      return arr.flatMap( (x) => {
          return arr.flatMap( (y) => {
              return (x['address'] != y['address']) ? [[x,y]] : []
          });
      });
  }

  const executeSwap = async () => {
    if(account && inToken['address'] !== outToken['address']) {
      const provider = await connector.getProvider();
      const limit = valueEth*0.99;
      if(middleToken)
        await batchSwapTokens(provider, inToken['address'], outToken['address'], middleToken, value*1, account, chain);
      else
        swapTokens(provider, inToken['address'], outToken['address'], value*1, account, limit, chain);
    }
  }

  const approveTk = async () => {
    if(account) {
      const provider = await connector.getProvider();
      const approvedToken = await approveToken(account, provider, inToken['address'], value*1.01, chain);
      setApproval(approvedToken > value);
    }
  }

  const setInLimit = () => {
    let val = inBal.replaceAll(',', '');
    setValue(Number(val));
    setLimitedout(false);
  }

  const setOutLimit = () => {
    // let val = outBal.replaceAll(',', '');
    // setValueEth(Number(val));
  }

  const getMiddleTokenSymbol = (tokens) => {
    debugger;
    if(tokens) {
        if(tokens.length == 2) {
        const result1 = uniList[chain].filter(item => {
          return item.address === tokens[0]['address'];
        });

        const result2 = uniList[chain].filter(item => {
          return item.address === tokens[1]['address'];
        });

        setMiddleTokenSymbol([result1[0].symbol, result2[0].symbol]);
      } else {
        const result1 = uniList[chain].filter(item => {
          return item.address === tokens[0]['address'];
        });

        setMiddleTokenSymbol([result1[0].symbol]);
      }
    } else {
      setMiddleTokenSymbol(['', '']);
    }
  }

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

  useEffect(() => {
    if(account) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        let inBal = await getTokenBalance(provider, inToken['address'], account);
        let outBal = await getTokenBalance(provider, outToken['address'], account);
        setInBal(inBal);
        setOutBal(outBal);
        checkApproved(inToken, value);
        const swapFeePercent = await getSwapFeePercent(provider, poolList[selected_chain][0]['address'], selected_chain);
        setSwapFee(swapFeePercent);

      }
      getInfo();
    }
  }, []);

  useEffect(() => {
    if(account && inToken !== outToken) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        setPoolAddress(poolAddress);
        if(middleToken) {
          const amountOut = await calcOutput(middleToken, provider, value, inToken, outToken);
          setValueEth(amountOut.toPrecision(6));
        } else {
          const poolAddress = await getPoolAddress(provider, inToken['address'], outToken['address'], chain);
          const poolData = await getPoolData(provider, poolAddress, chain);
          const amountOut = await calculateSwap(inToken, poolData, value);
          setValueEth(amountOut.toPrecision(6));
        }
      }

      getInfo();
    }
  }, [inToken, outToken, middleToken]);

  useEffect(() => {
    if(account && chain !== selected_chain) {
      setChain(selected_chain);
    }
  }, [dispatch, selected_chain]);

  useEffect(() => {
    if(account) {
      setFilterData(uniList[chain]);
      selectToken(uniList[chain][0], 0);
      selectToken(uniList[chain][1], 1);
    }
  }, [chain]);

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
                  <p className="text-base text-grey-dark" onClick={setInLimit}>
                    Balance: {inBal}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center text-light-primary text-2xl dark:text-grey-dark">
              <AiOutlineArrowDown onClick={reverseToken} />
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
                  <p className="text-base text-grey-dark" onClick={setOutLimit}>
                    Balance: {outBal}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <p className="text-grey-dark">Slippage {valSlipage}%</p>
            {(middleToken && middleToken.length == 2) && <p className="text-light-primary">{inToken.symbol} -> {middleTokenSymbol[0]} -> {middleTokenSymbol[1]} -> {outToken.symbol}</p>}
            {(middleToken && middleToken.length == 1) && <p className="text-light-primary">{inToken.symbol} -> {middleTokenSymbol[0]} -> {outToken.symbol}</p>}
            {!middleToken && <p className="text-light-primary">{inToken.symbol} -> {outToken.symbol}</p>}
            <p className="text-light-primary">Fee: {fee} {inToken.symbol}</p>
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
              disabled={limitedout}
            >
              {" "}
              {limitedout?"Not Enough Token":"Confirm"}
            </button>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={dark?"dark":""}
          >
            <StyledModal className="bg-white-bg  dark:bg-dark-primary">
              <h3 className="model-title mb-6">Select Token</h3>
              <TextField
                autoFocus={true}
                value={query}
                onChange={filterToken}
                label="Search"
                InputProps={{
                  type: "search",
                  style: {color: (dark?'#bbb':'#333')}
                }}
                InputLabelProps={{
                  style: {color: (dark?'#bbb':'#333')}
                }}
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
