import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useWeb3React } from "@web3-react/core";
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
import { getPoolData, getPoolBalance, removePool, fromWeiVal, getPoolSupply } from "../../config/web3";
import { poolList }  from "../../config/constants";

const RemoveLiquiditySimple = ({dark}) => {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [open, setOpen] = useState(false);
  const [rOpen, setROpen] = useState(false);
  const [value, setValue] = useState(0);
  const [weightA, setWeightA] = useState(0.5);
  const [price, setPrice] = useState(0);
  const [tokenAAddr, setTokenAAddr] = useState('');
  const [tokenBAddr, setTokenBAddr] = useState('');
  const [scale, setScale] = useState(50);
  const [lpPercentage, setLpPercentage] = useState(50);
  const [poolAmount, setPoolAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(poolList[selected_chain][0]);
  const [filterData, setFilterData] = useState(poolList[selected_chain]);
  const [query, setQuery] = useState("");
  const [totalLPTokens, setTotalLPTokens] = useState(0);
  const [poolBalanceA, setPoolBalanceA] = useState(0);
  const [poolBalanceB, setPoolBalanceB] = useState(0);
  const [outTokenA, setOutTokenA] = useState(0);
  const [outTokenB, setOutTokenB] = useState(0);
  const [poolAddresse, setPoolAddresse] = useState();
  const [poolDat, setPoolDat] = useState();
  const [limitedout, setLimitedout] = useState(false);

  const dispatch = useDispatch();

  const calculateSwap = (inToken, poolData, input) => {

    let ammount = input;
    
    let balance_from;
    let balance_to;
    let weight_from;
    let weight_to;
    
    if (inToken == poolData.tokens[0]){
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

  const handleOpen = () =>  {
    setQuery("");
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const handleValue = async (event) => {
    const val = Number(event.target.value);
    setValue(val);
    let inLimBal = poolAmount.replace(',', '');
    if(Number(event.target.value) <= Number(inLimBal))
      setLimitedout(false);
    else
      setLimitedout(true);
    let lpPercentage = Number((val/poolAmount*100).toFixed(2));
    setLpPercentage(lpPercentage);
    await calculateOutput(totalLPTokens, val, selectedItem);

  };

  const handleScale = async (event, newValue) => {
    setScale(newValue);
    setWeightA(newValue/100);
    await calculateOutput(totalLPTokens, value, selectedItem);

  }

  const handleSlider = async (event, newValue) => {
    setLpPercentage(newValue);
    const val = (poolAmount*(newValue/100)).toPrecision(6);
    setValue(val);
    await calculateOutput(totalLPTokens, val, selectedItem);
  };

  const filterLP = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if(search_qr.length != 0) {
      const filterDT = poolList[selected_chain].filter((item) => {
        return item['symbols'][0].toLowerCase().indexOf(search_qr) != -1 || item['symbols'][1].toLowerCase().indexOf(search_qr) != -1
      });
      setFilterData(filterDT);
    } else {
      setFilterData(poolList[[selected_chain]]);
    }
  }

  const selectToken = async (item) => {
    handleClose();
    if(account) {
      setSelectedItem(item);
      const provider = await connector.getProvider();
      const poolData = await getPoolData(provider, item['address'], selected_chain);
      const weightA = fromWeiVal(provider, poolData['weights'][0]);
      setWeightA(weightA);
      setScale((weightA*100).toPrecision(6));
      setTokenAAddr(poolData['tokens'][0]);
      setTokenBAddr(poolData['tokens'][1]);
      let amount = await getPoolBalance(account, provider, item['address'], selected_chain);
      amount = Number(amount).toPrecision(6);
      setPoolAmount(amount);
      setValue((amount*lpPercentage/100).toPrecision(6));
      let totalLPAmount = await getPoolSupply(provider, item['address'], selected_chain);
      setTotalLPTokens(totalLPAmount);
      await calculateOutput(totalLPAmount, amount*lpPercentage/100, item);
    }
  };

  const executeRemovePool = async () => {
    if(Number(value) <= 0 || Number(value) > poolAmount) {
      console.log('Wrong amount!');
    } else {
      const provider = await connector.getProvider();
      let amount1 = value*weightA;
      let amount2 = value*(1-weightA);
      let ratio = (1-scale/100).toFixed(8);
      await removePool(account, provider, selectedItem['address'], value, ratio, tokenAAddr, tokenBAddr, selected_chain);
    }
  }

  const calculateOutput =  async (totalLkTk, inValue, item) => {

    const provider = await connector.getProvider();
    const poolData = await getPoolData(provider, item['address'], selected_chain);
    let removeingPercentage = inValue/(Number(totalLkTk)+0.0000000001);
    let standardOutA = removeingPercentage * poolData.balances[0];
    let standardOutB = removeingPercentage * poolData.balances[1];
    
    let reqWeightA = (1-weightA) * (10**18);
    let reqWeightB =  weightA * (10**18);

    let outB = 0 ;
    let outA = 0 ;
    if (reqWeightB < Number(poolData.weights[1])){
      outB =standardOutB/poolData.weights[1]*reqWeightB
      let extraA = calculateSwap(poolData.tokens[1], poolData, (standardOutB-outB)) * (10 ** 18)
      outA = standardOutA + extraA;
    } else {
      outA = standardOutA/poolData.weights[0]*reqWeightA
      let extraB = calculateSwap(poolData.tokens[0], poolData, (standardOutA - outA)) * (10 ** 18)
      outB = standardOutB+extraB
    }

    const vaueA = outA.toLocaleString('fullwide', {useGrouping:false});
    const vaueB = outB.toLocaleString('fullwide', {useGrouping:false});
    debugger;
    const amount1 = fromWeiVal(provider, vaueA);
    const amount2 = fromWeiVal(provider, vaueB);
    setOutTokenA(Number(amount1));
    setOutTokenB(Number(amount2));
  }

  const setInLimit = () => {
    let val = poolAmount.replace(',', '');
    setValue(Number(val));
    setLpPercentage(100);
  }

  useEffect(() => {
    if(account) {
      const getInfo = async () => {
      const provider = await connector.getProvider();
      const poolData = await getPoolData(provider, poolList[selected_chain][0]['address'], selected_chain);
      const weightA = fromWeiVal(provider, poolData['weights'][1]);
      setPoolDat(poolData);
      setWeightA(weightA);
      setScale((weightA*100).toPrecision(6));
      setPrice((poolData.balances[0]/poolData.weights[0])/(poolData.balances[1]/poolData.weights[1]));
      setTokenAAddr(poolData['tokens'][0]);
      setTokenBAddr(poolData['tokens'][1]);
      let amount = await getPoolBalance(account, provider, poolList[selected_chain][0]['address'], selected_chain);
      let amount2 = await getPoolSupply(provider, poolList[selected_chain][0]['address'], selected_chain);
      amount = Number(amount).toPrecision(6);
      setTotalLPTokens(amount2);
      setPoolAmount(amount);
      setValue((amount*lpPercentage/100).toPrecision(6));
      setPoolBalanceA(poolData.balances[0])
      setPoolBalanceB(poolData.balances[1])
      await calculateOutput(amount2, amount*lpPercentage/100, poolList[selected_chain][0]);
    }
    getInfo();
    }
  }, []);

  useEffect(() => {
    if(account) {
      setFilterData(poolList[[selected_chain]]);
      selectToken(poolList[selected_chain][0]);
    }
  }, [dispatch, selected_chain, account]);

  return (
    <div className="bg-white-bg dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
      <h3 className="model-title mb-4">Remove Liquidity </h3>
      <div className=" flex justify-between">
        <p className="capitalize text-grey-dark">Ratio {Number(scale).toPrecision(4)}% {selectedItem['symbols'][0]} - {(100 - scale).toPrecision(4)}% {selectedItem['symbols'][1]}</p>
        <button
          onClick={() => setROpen(!rOpen)}
          className="capitalize text-light-primary dark:text-grey-dark"
        >
          Change Ratio %
        </button>
      </div>
      {rOpen && (
        <div className="my-4">
          <div className="text-light-primary mb-5 dark:text-grey-dark text-base capitalize ">
            Change Ratio
          </div>
          <Slider
            size="small"
            value={scale}
            onChange={handleScale}
            step={0.01}
            min={0.1}
            max={99.9}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
          <div className="flex">
            <button
              style={{ fontSize: 12, fontWeight: 400, minHeight: 32 }}
              className="flex-1 btn-primary text-primary dark:text-black"
            >
              {Number(scale).toPrecision(4)}% {selectedItem['symbols'][0]}
            </button>
            <button
              style={{
                fontSize: 12,
                fontWeight: 400,
                background: "#fafafa",
                minHeight: 32,
              }}
              className="flex-1 text-black"
            >
              <span>
                {(100 - scale).toPrecision(4)}% {selectedItem['symbols'][1]}
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
            <Button variant="outlined" startIcon={<div style={{float:'left'}}><img src={selectedItem['logoURLs'][0]} alt="" style={{ float:'left' }} /><img src={selectedItem['logoURLs'][1]} alt="" style={{float:'left', marginLeft:-5}} /></div>} style={{padding:'10px 15px'}} onClick={handleOpen} css={[tw`bg-white dark:bg-black`]}>
              {selectedItem['symbols'][0]} - {selectedItem['symbols'][1]} LP
            </Button>
            </div>
            <div className="sm:text-right text-left flex-1 w-full">
              {" "}
              <form>
                <input
                  type="number"
                  value={value}
                  min={0}
                  onChange={handleValue}
                  className="input-value text-right bg-transparent focus:outline-none"
                />
              </form>
              <p className="text-base text-grey-dark" onClick={setInLimit}>LP Balance: {poolAmount}</p>
            </div>
          </div>

          <div className="my-4">
            <div className="text-light-primary mb-5 dark:text-grey-dark text-base capitalize ">
              LP Amount
            </div>
            <Slider
              size="small"
              value={lpPercentage}
              step={0.01}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChange={handleSlider}
            />
          </div>
        </div>
      </div>

      <hr className="mb-4" />
      <div className="flex flex-col gap-y-4 mb-4">
        <div className="flex">
          <div className="text-base w-1/2 md:w-2/5 text-grey-dark">
            Recieve {selectedItem['symbols'][0]}
          </div>
          <div className="text-base text-light-primary dark:text-grey-dark flex-1">
            {(outTokenB).toPrecision(6)}
          </div>
        </div>
        <div className="flex">
          <div className="text-base w-1/2 md:w-2/5 text-grey-dark">
            Recieve {selectedItem['symbols'][1]}
          </div>
          <div className="text-base text-light-primary dark:text-grey-dark flex-1">
          {(outTokenA).toPrecision(6)}
          </div>
        </div>
      </div>
      <div className="">
        <button
          onClick={executeRemovePool}
          style={{ minHeight: 57 }}
          className="btn-primary rounded-sm font-bold w-full dark:text-black"
          disabled={limitedout}
        >
          {limitedout?"Not Enough Token":"Confirm"}
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        className={dark?"dark":""}
      >
        <StyledModal className="bg-white-bg  dark:bg-dark-primary">
          <h3 className="model-title mb-6">Remove Liquidity</h3>
          <TextField
            autoFocus={true}
            value={query}
            onChange={filterLP}
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
          <ul className="flex flex-col gap-y-6">
            {filterData.map((item) => {
              return (
                <li key={item['address']} className="flex gap-x-1" onClick={() => selectToken(item)}>
                  <div className="relative flex">
                    <img src={item['logoURLs'][0]} alt="" />
                    <img className="z-10 relative right-2" src={item['logoURLs'][1]} alt="" />
                  </div>
                  <p className="text-light-primary text-lg">{item['symbols'][0]} - {item['symbols'][1]} LP Token</p>
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
