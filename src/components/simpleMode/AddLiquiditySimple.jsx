import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { BsPlus } from "react-icons/bs";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import btc from "../../images/crypto/btc.svg";
import eth from "../../images/crypto/eth.svg";
import Slider from "@mui/material/Slider";
import Modal from "@mui/material/Modal";
import tw from "twin.macro";
import Autocomplete from "@mui/material/Autocomplete";
import { AiOutlineLineChart } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import { useWeightsData } from "../../config/chartData";
import {
  getTokenBalance,
  getPoolAddress,
  getPoolData,
  joinPool,
  tokenApproval,
  approveToken,
} from "gamut-sdk";
import { uniList } from "../../config/constants";
import { poolList } from "../../config/constants";
import { contractAddresses } from "../../config/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const AddLiquiditySimple = ({ dark }) => {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [isExist, setIsExist] = useState(false);
  const [rOpen, setROpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [ratio, setRatio] = useState(1);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = React.useState(0);
  const [poolAddress, setPoolAddress] = useState("");
  const [inToken, setInToken] = useState(uniList[selected_chain][0]);
  const [outToken, setOutToken] = useState(uniList[selected_chain][1]);
  const [value, setValue] = useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [inBal, setInBal] = useState(0);
  const [outBal, setOutBal] = useState(0);
  const [sliderValue, setSliderValue] = React.useState(50);
  const [approval, setApproval] = useState(false);
  const [filterData, setFilterData] = useState(uniList[selected_chain]);
  const [limitedout, setLimitedout] = useState(false);
  const [approval1, setApproval1] = useState(false);
  const [approval2, setApproval2] = useState(false);
  const [approvedVal1, setApprovedVal1] = useState(0);
  const [approvedVal2, setApprovedVal2] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [adding, setAdding] = useState(false);

  const dispatch = useDispatch();

  debugger;
  const weightData = useWeightsData(poolAddress.toLowerCase());

  const StyledModal = tw.div`
    flex
    flex-col
    relative
    m-auto
    top-1/4
    p-6
    shadow-box overflow-y-scroll
    min-h-min
    transform -translate-x-1/2 -translate-y-1/2
    sm:w-1/3 w-11/12
  `;

  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
    if (inToken["address"] != outToken["address"]) {
      let valEth = (ratio * (1 - newValue / 100) * value) / (newValue / 100);
      valEth =
        valEth * 1 === 0
          ? 0
          : valEth * 1 > 1
          ? valEth.toFixed(2)
          : valEth.toFixed(6);
      setValueEth(valEth);
    }
  };
  const handleOpen = (val) => {
    setQuery("");
    setSelected(val);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleValue = async (event) => {
    setValue(event.target.value);
    let inLimBal = inBal.replaceAll(",", "");
    let outLimBal = outBal.replaceAll(",", "");

    if (inToken["address"] != outToken["address"]) {
      let valEth =
        (event.target.value * ratio * (100 - sliderValue)) / sliderValue;
      valEth =
        valEth * 1 === 0
          ? 0
          : valEth * 1 > 1
          ? valEth.toFixed(2)
          : valEth.toFixed(6);
      setValueEth(valEth);
      checkApproved(inToken, outToken, poolAddress, event.target.value, valEth);

      if (
        Number(event.target.value) <= Number(inLimBal) &&
        Number(valEth) <= Number(outLimBal)
      )
        setLimitedout(false);
      else setLimitedout(true);
    }
  };

  const filterToken = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if (search_qr.length != 0) {
      const filterDT = uniList[selected_chain].filter((item) => {
        return item["symbol"].toLowerCase().indexOf(search_qr) != -1;
      });
      setFilterData(filterDT);
    } else {
      setFilterData(uniList[selected_chain]);
    }
  };

  const selectToken = async (token, selected) => {
    handleClose();
    var bal = 0;
    if (selected === 0) {
      setInToken(token);
    } else if (selected === 1) {
      setOutToken(token);
    }
    if (account) {
      const provider = await connector.getProvider();
      bal = await getTokenBalance(provider, token["address"], account);
      if (selected == 0) {
        setInBal(bal);
        let tempData = uniList[selected_chain].filter((item) => {
          return item["address"] !== token["address"];
        });
        setFilterData(tempData);
        try {
          const poolAddr = await getPoolAddress(
            provider,
            token["address"],
            outToken["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          const poolData = await getPoolData(
            provider,
            poolAddr
          );
          checkApproved(token, outToken, poolAddr, value, valueEth);
          setIsExist(true);
          const sliderInit = await sliderInitVal(poolData, token);
          setSliderValue(sliderInit * 100);
        } catch (error) {
          console.log(error.message);
          setIsExist(false);
        }

        let inLimBal = bal ? bal.replaceAll(",", "") : 0;
        let outLimBal = outBal ? outBal.replaceAll(",", "") : 0;
        if (
          Number(value) <= Number(inLimBal) &&
          Number(valueEth) <= Number(outLimBal)
        )
          setLimitedout(false);
        else setLimitedout(true);
      } else if (selected == 1) {
        setOutBal(bal);
        let tempData = uniList[selected_chain].filter((item) => {
          return item["address"] !== token["address"];
        });

        let inLimBal = inBal ? inBal.replaceAll(",", "") : 0;
        let outLimBal = bal ? bal.replaceAll(",", "") : 0;
        if (
          Number(value) <= Number(inLimBal) &&
          Number(valueEth) <= Number(outLimBal)
        )
          setLimitedout(false);
        else setLimitedout(true);

        setFilterData(tempData);
        setOutToken(token);

        try {
          const poolAddr = await getPoolAddress(
            provider,
            inToken["address"],
            token["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          const poolData = await getPoolData(provider, poolAddr);
          checkApproved(inToken, token, poolAddr, value, valueEth);
          setIsExist(true);
          const sliderInit = await sliderInitVal(poolData, inToken);
          setSliderValue(sliderInit * 100);
        } catch (error) {
          console.log(error.message);
          setIsExist(false);
        }
      }
    }
  };

  const sliderInitVal = async (poolData, inToken) => {
    let balance_from;
    let balance_to;
    let weight_from;
    let weight_to;

    if (inToken["address"] == poolData.tokens[0]) {
      balance_from = poolData.balances[0];
      balance_to = poolData.balances[1];
      weight_from = poolData.weights[0];
      weight_to = poolData.weights[1];
    } else {
      balance_from = poolData.balances[1];
      balance_to = poolData.balances[0];
      weight_from = poolData.weights[1];
      weight_to = poolData.weights[0];
    }

    let pricePool = balance_from / weight_from / (balance_to / weight_to);
    let x = weight_from / 10 ** 18;

    return x;
  };

  const checkApproved = async (token1, token2, poolAddr, val1, val2) => {
    const provider = await connector.getProvider();
    const approved1 = await tokenApproval(
      account,
      provider,
      token1["address"],
      contractAddresses[selected_chain]["router"]
    );
    const approved2 = await tokenApproval(
      account,
      provider,
      token2["address"],
      contractAddresses[selected_chain]["router"]
    );
    setApproval1(approved1 * 1 >= val1 * 1);
    setApproval2(approved2 * 1 >= val1 * 1);
    setApprovedVal1(approved1);
    setApprovedVal2(approved2);
    setApproval(approved1 * 1 >= val1 * 1 && approved2 * 1 >= val2 * 1);
  };

  const calculateRatio = async (inToken, poolData, input) => {
    let weight_from;
    let weight_to;
    let balance_from;
    let balance_to;
    if (inToken["address"] == poolData.tokens[0]) {
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
    let price = balance_to / weight_to / (balance_from / weight_from);
    let some = (price * input * weight_to) / weight_from;

    setRatio(price);
    let valEth = (price * input * weight_to) / weight_from;
    valEth =
      valEth * 1 === 0
        ? 0
        : valEth * 1 > 1
        ? valEth.toFixed(2)
        : valEth.toFixed(6);
    valEth = valEth * 1 === 0 ? 0 : valEth;
    setValueEth(valEth);
  };

  const executeAddPool = async () => {
    if (inToken["address"] != outToken["address"]) {
      const provider = await connector.getProvider();
      setAdding(true);
      await joinPool(
        account,
        provider,
        inToken["address"],
        outToken["address"],
        value,
        valueEth,
        contractAddresses[selected_chain]["router"],
        contractAddresses[selected_chain]["hedgeFactory"]
      );
      setAdding(false);
    }
  };

  const clickConWallet = () => {
    document.getElementById("connect_wallet_btn").click();
  };

  const approveTK1 = async (toVal) => {
    if (account) {
      const provider = await connector.getProvider();
        setUnlocking(true);
        const approved1 = await approveToken(
          account,
          provider,
          inToken["address"],
          toVal * 1.1,
          contractAddresses[selected_chain]["router"]
        );
        setUnlocking(false);
        setApproval1(approved1 * 1 > value * 1);
        setApprovedVal1(approved1);        
        setApproval(approved1 > value * 1 && approval2);
    }
  };

  const approveTK2 = async (toVal) => {
    if (account) {
      const provider = await connector.getProvider();
      setUnlocking(true);
      const approved2 = await approveToken(
        account,
        provider,
        outToken["address"],
        toVal * 1.1,
        contractAddresses[selected_chain]["router"]
      );
      setUnlocking(false);
      setApproval2(approved2 * 1 > valueEth * 1);
      setApprovedVal2(approved2);
      setApproval(approval1 && approved2 > valueEth * 1);
    }
  };


  const setInLimit = () => {
    let val1 = inBal ? inBal.replaceAll(",", "") : 0;
    let val2 = outBal ? outBal.replaceAll(",", "") : 0;
    setValue(Number(val1));
    if (valueEth < val2) setLimitedout(false);
    else setLimitedout(true);
  };

  const getCurrentPoolAddress = async () => {
    for (var i = 0; i < poolList[selected_chain].length; i++) {
      if (
        (poolList[selected_chain][i]["symbols"][0] === inToken["symbol"] &&
          poolList[selected_chain][i]["symbols"][1] === outToken["symbol"]) ||
        (poolList[selected_chain][i]["symbols"][1] === inToken["symbol"] &&
          poolList[selected_chain][i]["symbols"][0] === outToken["symbol"])
      ) {
        setPoolAddress(poolList[selected_chain][i]["address"].toLowerCase());
        break;
      }
    }
  };

  const getInitialInfo = async () => {
    try {
      const provider = await connector.getProvider();
      const poolAddress = await getPoolAddress(
        provider,
        inToken["address"],
        outToken["address"],
        contractAddresses[selected_chain]["hedgeFactory"]
      );
      const poolData = await getPoolData(provider, poolAddress);
      setIsExist(true);
      setPoolAddress(poolAddress);
      await calculateRatio(inToken, poolData, value);
    } catch (error) {
      setIsExist(false);
    }
  };

  const CustomTooltip0 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      var eventTime = new Date(payload[0].payload["timestamp"] * 1000);
      var year = eventTime.getUTCFullYear();
      var month =
        eventTime.getUTCMonth() + 1 < 10
          ? "0" + (eventTime.getUTCMonth() + 1)
          : eventTime.getUTCMonth() + 1;
      var day =
        eventTime.getUTCDate() < 10
          ? "0" + eventTime.getUTCDate()
          : eventTime.getUTCDate();
      var hour =
        eventTime.getUTCHours() < 10
          ? "0" + eventTime.getUTCHours()
          : eventTime.getUTCHours();
      var min =
        eventTime.getUTCMinutes() < 10
          ? "0" + eventTime.getUTCMinutes()
          : eventTime.getUTCMinutes();
      var sec =
        eventTime.getUTCSeconds() < 10
          ? "0" + eventTime.getUTCSeconds()
          : eventTime.getUTCSeconds();
      eventTime =
        year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
      return (
        <div
          className="custom-tooltip"
          style={{ backgroundColor: "white", padding: 5 }}
        >
          <p className="label fw-bold">{eventTime}</p>
          <p className="label">
            {payload[0].payload["token0"]} : {payload[0].payload["weight0"]}
          </p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      var eventTime = new Date(payload[0].payload["timestamp"] * 1000);
      var year = eventTime.getUTCFullYear();
      var month =
        eventTime.getUTCMonth() + 1 < 10
          ? "0" + (eventTime.getUTCMonth() + 1)
          : eventTime.getUTCMonth() + 1;
      var day =
        eventTime.getUTCDate() < 10
          ? "0" + eventTime.getUTCDate()
          : eventTime.getUTCDate();
      var hour =
        eventTime.getUTCHours() < 10
          ? "0" + eventTime.getUTCHours()
          : eventTime.getUTCHours();
      var min =
        eventTime.getUTCMinutes() < 10
          ? "0" + eventTime.getUTCMinutes()
          : eventTime.getUTCMinutes();
      var sec =
        eventTime.getUTCSeconds() < 10
          ? "0" + eventTime.getUTCSeconds()
          : eventTime.getUTCSeconds();
      eventTime =
        year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
      return (
        <div
          className="custom-tooltip"
          style={{ backgroundColor: "white", padding: 5 }}
        >
          <p className="label fw-bold">{eventTime}</p>
          <p className="label">
            {payload[0].payload["token1"]} : {payload[0].payload["weight1"]}
          </p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (account) {
      const intervalId = setInterval(() => {
        getInitialInfo();
      }, 40000);
      return () => clearInterval(intervalId);
    } else {
      const intervalId = setInterval(() => {
        getCurrentPoolAddress();
      }, 40000);
      return () => clearInterval(intervalId);
    }
  }, [account, value, inToken, outToken]);

  useEffect(() => {
    if (account && inToken["address"] !== outToken["address"]) {
      getInitialInfo();
    } else {
      getCurrentPoolAddress();
    }
  }, [inToken, outToken]);

  useEffect(() => {
    setFilterData(uniList[selected_chain]);
    selectToken(uniList[selected_chain][0], 0);
    selectToken(uniList[selected_chain][1], 1);
  }, [dispatch, selected_chain]);

  const formattedWeightsData = useMemo(() => {
    if (weightData && weightData.weights) {
      return weightData.weights.map((item, index) => {
        var tempArr = {};
        tempArr["name"] = index;
        tempArr["weight0"] = Number(item.weight0).toFixed(2);
        tempArr["weight1"] = Number(item.weight1).toFixed(2);
        tempArr["token0"] = item.token0.symbol;
        tempArr["token1"] = item.token1.symbol;
        tempArr["timestamp"] = item.timestamp;
        return tempArr;
      });
    } else {
      return [];
    }
  }, [weightData]);


  return (
    <div className="d-flex flex-col">
      <div className="flex gap-x-8 justify-end mb-5">
        <button
          onClick={() => setChartOpen(!chartOpen)}
          className="flex text-light-primary gap-x-3 dark:text-grey-dark text-lg mt-2"
        >
          <p className="capitalize"> Chart</p>
          <span className="text-3xl">
            <AiOutlineLineChart />
          </span>
        </button>
      </div>
      <div className="flex sm:flex-row flex-col items-center">
        {chartOpen && formattedWeightsData && (
          <div className="flex-1 w-full mb-4">
            {formattedWeightsData[0] && (
              <h3 className="model-title mb-4" style={{ fontSize: 18 }}>
                <b>{formattedWeightsData[0]["token0"]}</b> weight
              </h3>
            )}
            <ResponsiveContainer width="95%" height={250}>
              <LineChart
                width={500}
                height={200}
                data={formattedWeightsData}
                syncId="anyId"
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
                <Tooltip content={<CustomTooltip0 />} />
                <Line
                  type="monotone"
                  dataKey="weight0"
                  stroke="#8884d8"
                  fill="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            {formattedWeightsData[0] && (
              <h3 className="model-title mb-4" style={{ fontSize: 18 }}>
                <b>{formattedWeightsData[0]["token1"]}</b> weight
              </h3>
            )}
            <ResponsiveContainer width="95%" height={250}>
              <LineChart
                width={500}
                height={200}
                data={formattedWeightsData}
                syncId="anyId"
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
                <Tooltip content={<CustomTooltip1 />} />
                <Line
                  type="monotone"
                  dataKey="weight1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  strokeWidth={2}
                />
                <Brush />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="max-w-2xl mx-auto flex-1 bg-white-bg dark:bg-dark-primary rounded shadow-box border sm:p-6 p-4 border-grey-dark">
          <h3 className="model-title mb-4">Add Liquidity </h3>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <p className="capitalize text-grey-dark mr-1">
              Ratio {sliderValue.toPrecision(4)}% {inToken["symbol"]} -{" "}
              {(100 - sliderValue).toPrecision(4)}% {outToken["symbol"]}
            </p>
            <button
              onClick={() => setROpen(!rOpen)}
              className="capitalize text-light-primary dark:text-grey-dark sm:text-right text-left"
            >
              Change Ratio %
            </button>
          </div>
          {rOpen && (
            <div className="my-4">
              <Slider
                size="small"
                value={sliderValue}
                onChange={handleSlider}
                step={0.01}
                min={0.1}
                max={99.9}
                aria-label="Small"
                disabled={!isExist}
                valueLabelDisplay="auto"
              />
              <div className="flex">
                <button
                  style={{ fontSize: 12, fontWeight: 400, minHeight: 32 }}
                  className="flex-1 btn-primary text-primary dark:text-black"
                >
                  {sliderValue.toPrecision(4)}% {inToken["symbol"]}
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
                    {(100 - sliderValue).toPrecision(4)}% {outToken["symbol"]}
                  </span>
                </button>
              </div>
            </div>
          )}
          <hr className="my-4" />
          <div className="w-full flex flex-col gap-y-6">
            <div>
              <h3 className="input-lable mb-4">Input</h3>
              <div className="flex flex-wrap flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                <div className="flex flex-row w-full">
                  <div className="w-full">
                    <Button
                      variant="outlined"
                      startIcon={
                        <img
                          src={inToken["logoURL"]}
                          alt=""
                          className="w-5 sm:w-8"
                        />
                      }
                      style={{ padding: "8px", fontSize: "13px" }}
                      onClick={() => handleOpen(0)}
                    >
                      {inToken["symbol"]}
                    </Button>
                  </div>
                  <input
                    type="number"
                    value={value}
                    min={0}
                    onChange={handleValue}
                    className="input-value max-w-[300px] sm:max-w-none w-full text-right bg-transparent focus:outline-none"
                    disabled={!isExist}
                  ></input>
                </div>
                <div className="text-right w-full flex-1">
                  <p className="text-base text-grey-dark" onClick={setInLimit}>
                    Balance: {inBal}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center items-center text-light-primary text-2xl dark:text-grey-dark">
              <BsPlus />
            </div>
            <div>
              <div className="flex flex-wrap flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                <div className="flex flex-row w-full">
                  <div className="w-full">
                    <Button
                      variant="outlined"
                      startIcon={
                        <img
                          src={outToken["logoURL"]}
                          alt=""
                          className="w-5 sm:w-8"
                        />
                      }
                      style={{ padding: "8px", fontSize: "13px" }}
                      onClick={() => handleOpen(1)}
                    >
                      {outToken["symbol"]}
                    </Button>
                  </div>
                  <input
                    type="number"
                    value={valueEth}
                    min={0}
                    className="input-value max-w-[300px] sm:max-w-none w-full text-right bg-transparent focus:outline-none"
                    disabled
                  ></input>
                </div>
                <div className="text-right w-full flex-1">
                  <p className="text-base text-grey-dark" onClick={setInLimit}>
                    Balance: {outBal}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {account && (
              <>
                {isExist && !limitedout && Number(value)!=0 ? (
                  <>
                    {approval ? (
                      <button
                        onClick={executeAddPool}
                        style={{ minHeight: 57 }}
                        className={
                          adding?"btn-disabled font-bold w-full dark:text-black flex-1 mt-20":(
                            approval
                            ? "btn-primary font-bold w-full dark:text-black flex-1 mt-20"
                            : "btn-primary font-bold w-full dark:text-black flex-1 ml-2 mt-20"
                            )
                        }
                        disabled={limitedout || !isExist || adding}
                      >
                        {adding?"Adding Liquidity":"Add Liquidity"}
                      </button>
                    ) : (
                      <div className="mt-20 flex">
                        <button
                          onClick={() => {!approval1 ? approveTK1(Number(value - approvedVal1)) : approveTK2(Number(valueEth - approvedVal2))}}
                          style={{ minHeight: 57 }}
                          className={
                            unlocking?"btn-disabled font-bold w-full dark:text-black flex-1 mr-2":
                            (approval ? "btn-primary font-bold w-full dark:text-black flex-1" : "btn-primary font-bold w-full dark:text-black flex-1 mr-2")
                          }
                          disabled={unlocking}
                        >
                        {unlocking?"Unlocking...":(!approval1?"Unlock "+Number(value - approvedVal1).toFixed(4)
                                .toString()
                                .concat("", inToken["value"].toUpperCase())
                            : "Unlock "+Number(valueEth - approvedVal2).toFixed(4)
                                .toString()
                                .concat("", outToken["value"].toUpperCase()))}
                        </button>
                        <button
                          onClick={() => {!approval1 ? approveTK1(99999) : approveTK2(99999)}}
                          style={{ minHeight: 57 }}
                          className={
                            unlocking?"btn-disabled font-bold w-full dark:text-black flex-1 mr-2":
                            (approval ? "btn-primary font-bold w-full dark:text-black flex-1" : "btn-primary font-bold w-full dark:text-black flex-1 mr-2")
                          }
                          disabled={unlocking}
                        >
                          {unlocking?"Unlocking...":"Infinite Unlock"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="btn-disabled font-bold w-full dark:text-black mt-20 flex-1"
                    style={{ minHeight: 57 }}
                  >
                    {""}
                    {!isExist ? "Invalid Pair" : "Insufficient Blanance"}
                  </button>
                )}
              </>
            )}

            {!account && (
              <button
                onClick={clickConWallet}
                style={{ minHeight: 57 }}
                className="btn-primary font-bold w-full dark:text-black flex-1"
              >
                {"Connect to Wallet"}
              </button>
            )}
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className={dark ? "dark" : ""}
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
                  style: { color: dark ? "#bbb" : "#333" },
                }}
                InputLabelProps={{
                  style: { color: dark ? "#bbb" : "#333" },
                }}
              />
              <hr className="my-6" />
              <ul className="flex flex-col gap-y-6">
                {filterData.map((item) => {
                  return (
                    <li
                      key={item["address"]}
                      className="flex gap-x-1"
                      onClick={() => selectToken(item, selected)}
                    >
                      <div className="relative flex">
                        <img src={item["logoURL"]} alt="" />
                      </div>
                      <p className="text-light-primary text-lg">
                        {item["symbol"]}
                      </p>
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

export default AddLiquiditySimple;
