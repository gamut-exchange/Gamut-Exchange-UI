import React, { useState, useEffect } from "react";
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
import { getPoolData, getPoolBalance, removePool, fromWeiVal } from "../../config/web3";
import { poolList }  from "../../config/constants";

const RemoveLiquiditySimple = () => {

  const { account, connector } = useWeb3React();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [weightA, setWeightA] = useState(0.5);
  const [tokenAAddr, setTokenAAddr] = useState('');
  const [tokenBAddr, setTokenBAddr] = useState('');
  const [lpPercentage, setLpPercentage] = useState(50);
  const [poolAmount, setPoolAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(poolList[0]);
  const [filterData, setFilterData] = useState(poolList);

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleValue = (event) => {
    const val = Number(event.target.value);
    setValue(val);
    let lpPercentage = Number((val/poolAmount*100).toFixed(2));
    setLpPercentage(lpPercentage);
  };

  const handleSlider = (event, newValue) => {
    setLpPercentage(newValue);
    const val = (poolAmount*(newValue/100)).toPrecision(6);
    setValue(val);
  };

  const selectToken = async (item) => {
    handleClose();
    if(account) {
      setSelectedItem(item);
      const provider = await connector.getProvider();
      const poolData = await getPoolData(provider, item['address']);
      const weightA = fromWeiVal(provider, poolData['weights'][0]);
      setWeightA(weightA);
      setTokenAAddr(poolData['tokens'][0]);
      setTokenBAddr(poolData['tokens'][1]);
      let amount = await getPoolBalance(account, provider, poolList[0]['address']);
      amount = Number(amount).toPrecision(6);
      setPoolAmount(amount);
      setValue((amount*lpPercentage/100).toPrecision(6));
    }
  };

  const executeRemovePool = async () => {
    if(Number(value) <= 0 || Number(value) > poolAmount) {
      console.log('Wrong amount!');
    } else {
      const provider = await connector.getProvider();
      let amount1 = value*weightA;
      let amount2 = value*(1-weightA);
      await removePool(account, provider, selectedItem['address'], value, amount1, amount2, tokenAAddr, tokenBAddr);
    }
  }

  useEffect(() => {
    if(account) {
      const getInfo = async () => {
      const provider = await connector.getProvider();
      const poolData = await getPoolData(provider, poolList[0]['address']);
      debugger;
      const weightA = fromWeiVal(provider, poolData['weights'][0]);
      setWeightA(weightA);
      setTokenAAddr(poolData['tokens'][0]);
      setTokenBAddr(poolData['tokens'][1]);
      let amount = await getPoolBalance(account, provider, poolList[0]['address']);
      amount = Number(amount).toPrecision(6);
      setPoolAmount(amount);
      setValue((amount*lpPercentage/100).toPrecision(6));
    }

    getInfo();

    }
  }, []);

  return (
    <div className="bg-white-bg dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
      <h3 className="model-title mb-4">Remove Liquidity </h3>
      <hr className="my-4" />

      <div className="w-full flex flex-col gap-y-6">
        <div>
          <div className="flex justify-between sm:flex-row flex-col gap-y-8 items-center p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
            <div className="flex-1 w-full">
            <Button variant="outlined" startIcon={<div style={{float:'left'}}><img src={poolList[0]['logoURLs'][0]} alt="" style={{ float:'left' }} /><img src={poolList[0]['logoURLs'][1]} alt="" style={{float:'left', marginLeft:-5}} /></div>} style={{padding:'10px 15px'}} onClick={handleOpen} css={[tw`bg-white dark:bg-black`]}>
              {poolList[0]['symbols'][0]} - {poolList[0]['symbols'][1]} LP
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
                ></input>
              </form>
              <p className="text-base text-grey-dark">LP Balance: {poolAmount}</p>
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
            {(poolAmount*(lpPercentage/100)*(weightA)).toPrecision(6)}
          </div>
        </div>
        <div className="flex">
          <div className="text-base w-1/2 md:w-2/5 text-grey-dark">
            Recieve {selectedItem['symbols'][1]}
          </div>
          <div className="text-base text-light-primary dark:text-grey-dark flex-1">
            {(poolAmount*(lpPercentage/100)*(1-weightA)).toPrecision(6)}
          </div>
        </div>
      </div>
      <div className="">
        <button
          onClick={executeRemovePool}
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
            options={filterData.map((option) => option.value)}
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
          <ul className="flex flex-col gap-y-6">
            {filterData.map((item) => {
              return (
                <li key={item['address']} className="flex gap-x-1" onClick={() => selectToken(item)}>
                  <div className="relative flex">
                    <img src={item['logoURLs'][0]} alt="" />
                    <img className="z-10 relative right-2" src={item['logoURLs'][1]} alt="" />
                  </div>
                  <p className="text-light-primary text-lg">{item['symbols'][0]} - {item['symbols'][0]} LP Token</p>
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
