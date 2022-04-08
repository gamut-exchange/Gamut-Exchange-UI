import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
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
import { getTokenBalance, getPoolAddress, getPoolData, joinPool, getPoolBalance, tokenApproval, approvePool, approveToken } from "../../config/web3";
import { uniList }  from "../../config/constants";

const AddLiquiditySimple = () => {

  const { account, connector } = useWeb3React();
  const [rOpen, setROpen] = useState(false);
  const [ratio, setRatio] = useState(1);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = React.useState(0);
  const [poolAddress, setPoolAddress] = useState('');
  const [inToken, setInToken] = useState(uniList[0]);
  const [outToken, setOutToken] = useState(uniList[1]);
  const [value, setValue] = useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [inBal, setInBal] = useState(0);
  const [outBal, setOutBal] = useState(0);
  const [firstToken, setFirstToken] = useState('');
  const [sliderValue, setSliderValue] = React.useState(50);
  const [approval, setApproval] = useState(false);
  const [filterData, setFilterData] = useState(uniList);

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

  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
    if(inToken['address'] != outToken['address']) {
      setValueEth(((ratio*(1-newValue/100)*value)/(newValue/100)).toFixed(4));
    }
  };
  const handleOpen = (val) => {
    setQuery("");
    setSelected(val);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleValueEth = (event) => {
    setValueEth(event.target.value);
    if(inToken['address'] != outToken['address']) {
      setSliderValue(Number((ratio*value/(Number(event.target.value)+ratio*value)*100).toFixed(2)));
      checkApproved(value, event.target.value);
    }
  };

  const handleValue = async (event) => {
    setValue(event.target.value);
    if(inToken['address'] != outToken['address']) {
      let valEth = ((event.target.value*(ratio)*(100-sliderValue))/(sliderValue)).toFixed(4);
      console.log(ratio)
      console.log(sliderValue)
      console.log(100-sliderValue)
      console.log(((ratio*event.target.value*(100-sliderValue))/(sliderValue)))
      setValueEth(valEth);
      checkApproved(event.target.value, valEth);
    }
  };

  const filterToken = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if(search_qr.length != 0) {
      const filterDT = uniList.filter((item) => {
        return item['symbol'].toLowerCase().indexOf(search_qr) != -1
      });
      setFilterData(filterDT);
    } else {
      setFilterData(uniList);
    }
  }

  const selectToken = async (token, selected) => {
    handleClose()
    var bal = 0;
    if(account)
      bal = await getTokenBalance(token['address'], account);
    if(selected == 0) {
      setInBal(bal);
      let tempData = uniList.filter((item) => {
        return item['address'] !== token['address']
      });
      setFilterData(tempData);
      setInToken(token);
      checkApproved(value, valueEth);
    } else if (selected == 1) {
      setOutBal(bal);
      let tempData = uniList.filter((item) => {
        return item['address'] !== token['address']
      });

      setFilterData(tempData);
      setOutToken(token);
      checkApproved(value, valueEth);
    }
  }

  const checkApproved = async (val1, val2) => {
      const provider = await connector.getProvider();
      const approved1 = await tokenApproval(account, provider, inToken['address']);
      const approved2 = await tokenApproval(account, provider, outToken['address']);
      setApproval(approved1*1 > val1*1 && approved2*1 > val2*1);
  }

  const calculateRatio = async (inToken, poolData, input) => {
    let weight_from;
    let weight_to;
    let balance_from;
    let balance_to;
    if (inToken['address'] == poolData.tokens[0]){
        balance_from = poolData.balances[0];
        balance_to = poolData.balances[1];
        weight_from = poolData.weights[0];
        weight_to = poolData.weights[1];
    } else {
        weight_from = poolData.weights[1];
        weight_to = poolData.weights[0];
        balance_from = poolData.balances[1];
        balance_to = poolData.balances[0];
    }
    let price = (balance_to/weight_to)/(balance_from/weight_from);
    let some = (price*input*weight_to)/weight_from;

    setRatio(price);
    setValueEth(((price*input*weight_to)/weight_from).toFixed(4));
  }

  

  const executeAddPool = async () => {
    if(inToken['address'] != outToken['address']) {
      const provider = await connector.getProvider();
      if(inToken['address'] == firstToken)
        await joinPool(account, provider, inToken['address'], outToken['address'], value, valueEth);
      else
        await joinPool(account, provider, outToken['address'], inToken['address'], valueEth, value);
    }
  }

  const approveTK = async () => {
    if(account) {
      const provider = await connector.getProvider();
      const approved1 = await approveToken(account, provider, inToken['address'], value);
      const approved2 = await approveToken(account, provider, outToken['address'], valueEth);
      setApproval(approved1*1 > value*1 && approved2*1 > valueEth*1);
    }
  }

  useEffect(() => {
    if (account) {
      const getInfo = async () => {
        let inBal = await getTokenBalance(inToken['address'], account);
        let outBal = await getTokenBalance(outToken['address'], account);
        setInBal(inBal);
        setOutBal(outBal);
        const provider = await connector.getProvider();
        const poolAddress = await getPoolAddress(inToken['address'], outToken['address']);
        const poolData = await getPoolData(provider, poolAddress);

        const sliderInit = await sliderInitVal(poolData, inToken);

        setFirstToken(poolData['tokens'][0]);
        setPoolAddress(poolAddress);
        setSliderValue(sliderInit*100);
        await calculateRatio(inToken, poolData, value);
        checkApproved(value, valueEth);
      }
      getInfo();
    }
  }, []);

  const sliderInitVal = async (poolData, inToken) => {

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

    console.log(pricePool);
    let x = weight_from / (10 **18) ;

    return x;

  };

  useEffect(() => {
    if(account && inToken['address'] !== outToken['address']) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        const poolAddress = await getPoolAddress(inToken['address'], outToken['address']);
        const poolData = await getPoolData(provider, poolAddress);
        setPoolAddress(poolAddress);
        await calculateRatio(inToken, poolData, value);
      }

      getInfo();
    }
  }, [inToken, outToken]);

  return (
    <div className="bg-white-bg dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
      <h3 className="model-title mb-4">Add Liquidity </h3>
      <div className=" flex justify-between">
        <p className="capitalize text-grey-dark">Ratio 50% BTC - 50% ETH</p>
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
            value={sliderValue}
            onChange={handleSlider}
            step={0.01}
            min={0.1}
            max={99.9}
            aria-label="Small"
            valueLabelDisplay="auto"
          />
          <div className="flex">
            <button
              style={{ fontSize: 12, fontWeight: 400, minHeight: 32 }}
              className="flex-1 btn-primary"
            >
              {sliderValue.toPrecision(4)}% BTC
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
                {(100 - sliderValue).toPrecision(4)}% ETH
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
              <Button variant="outlined" startIcon={<img src={inToken['logoURL']} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(0)}>
                { inToken['symbol'] }
              </Button>
            </div>
            <div className="text-right flex-1">
              <form>
                <input
                  type="number"
                  value={value}
                  min={0}
                  onChange={handleValue}
                  className="input-value max-w-[300px] sm:max-w-none w-full text-right bg-transparent focus:outline-none"
                ></input>
              </form>
              <p className="text-base text-grey-dark">Balance: {inBal}</p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center text-light-primary text-2xl dark:text-grey-dark">
          <BsPlus />
        </div>

        <div>
          <h3 className="input-lable mb-4">Output</h3>
          <div className="flex flex-wrap sm:flex-row flex-col justify-between sm:items-center  rounded-sm p-2 sm:p-4 bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
            <div>
              <Button variant="outlined" startIcon={<img src={outToken['logoURL']} alt="" />} style={{padding:'10px 15px'}} onClick={() =>handleOpen(1)}>
                { outToken['symbol'] }
              </Button>
            </div>
            <div className="text-right">
              <form>
                <input
                  type="number"
                  value={valueEth}
                  onChange={handleValueEth}
                  min={0}
                  className="input-value text-right max-w-[300px] sm:max-w-none w-full bg-transparent focus:outline-none"
                ></input>
              </form>
              <p className="text-base text-grey-dark">Balance: {outBal}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 flex">
      {!approval &&
        <button
          onClick={approveTK}
          style={{ minHeight: 57,  }}
          className={approval?"btn-primary font-bold w-full dark:text-black flex-1":"btn-primary font-bold w-full dark:text-black flex-1 mr-2"}
        >
          {" "}
          Approval{" "}
        </button>
      }
        <button
          onClick={executeAddPool}
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
          <TextField
            autoFocus={true}
            value={query}
            onChange={filterToken}
            label="Search"
            InputProps={{
              type: "search",
              style: {color: '#333'}
            }}
            InputLabelProps={{
              style: { color: '#333' },
            }}
          />
          <hr className="my-6" />
          <ul className="flex flex-col gap-y-6">
            {filterData.map((item) => {
              return (
                <li key={item['address']} className="flex gap-x-1" onClick={() => selectToken(item, selected)}>
                  <div className="relative flex">
                    <img src={item['logoURL']} alt="" />
                  </div>
                  <p className="text-light-primary text-lg">{item['symbol']}</p>
                </li>
              );
            })}
          </ul>
        </StyledModal>
      </Modal>
    </div>
  );
};

export default AddLiquiditySimple;
