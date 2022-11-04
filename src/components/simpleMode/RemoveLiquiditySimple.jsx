import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import eth from "../../images/crypto/eth.svg";
import btc from "../../images/crypto/btc.svg";
import Slider from "@mui/material/Slider";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import tw from "twin.macro";
import Autocomplete from "@mui/material/Autocomplete";
import { AiOutlineLineChart } from "react-icons/ai";
import TextField from "@mui/material/TextField";
import { useWeightsData } from "../../config/chartData";
import {
  getPoolData,
  getPoolBalance,
  removePool,
  fromWeiVal,
  getPoolSupply,
} from "gamut-sdk";
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

const RemoveLiquiditySimple = ({ dark }) => {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [open, setOpen] = useState(false);
  const [rOpen, setROpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [weightA, setWeightA] = useState(0.5);
  const [price, setPrice] = useState(0);
  const [tokenAAddr, setTokenAAddr] = useState("");
  const [tokenBAddr, setTokenBAddr] = useState("");
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
  const [poolData, setPoolData] = useState();
  const [limitedout, setLimitedout] = useState(false);
  const [removing, setRemoving] = useState(false);

  const dispatch = useDispatch();
  const weightData = useWeightsData(selectedItem["address"].toLowerCase());

  // console.log("pool balance", poolBalanceA, poolBalanceB, totalLPTokens)

  const calculateSwap = (inToken, poolData, input) => {
    let ammount = input;
    let balance_from;
    let balance_to;
    let weight_from;
    let weight_to;

    if (inToken == poolData.tokens[0]) {
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

    let bIn = ammount / 10 ** 18;
    let pbA = balance_to / 10 ** 18;
    let pbB = balance_from / 10 ** 18;
    let wA = weight_to / 10 ** 18;
    let wB = weight_from / 10 ** 18;

    let exp =
      (wB - (wB * (1 - pbB / (pbB + bIn))) / (1 + pbB / (pbB + bIn))) /
      (wA + (wB * (1 - pbB / (pbB + bIn))) / (1 + pbB / (pbB + bIn)));
    let bOut = pbA * (1 - (pbB / (pbB + bIn)) ** exp);

    return bOut;
  };

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

  const clickConWallet = () => {
    document.getElementById("connect_wallet_btn").click();
  }

  const handleOpen = () => {
    setQuery("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleValue = async (event) => {
    const val = Number(event.target.value);
    setValue(val);
    let inLimBal = poolAmount.replace(",", "");
    if (Number(event.target.value) <= Number(inLimBal)) setLimitedout(false);
    else setLimitedout(true);
    let lpPercentage = Number(((val / poolAmount) * 100).toFixed(2));
    setLpPercentage(lpPercentage);
    await calculateOutput(totalLPTokens, val);
  };

  const handleScale = async (event, newValue) => {
    setScale(newValue);
    setWeightA(newValue / 100);
    await calculateOutput(totalLPTokens, value);
  };

  const handleSlider = async (event, newValue) => {
    setLpPercentage(newValue);
    const val = (poolAmount * (newValue / 100)).toPrecision(6);
    setValue(val);
    await calculateOutput(totalLPTokens, val);
  };

  const filterLP = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if (search_qr.length != 0) {
      const filterDT = poolList[selected_chain].filter((item) => {
        return (
          item["symbols"][0].toLowerCase().indexOf(search_qr) != -1 ||
          item["symbols"][1].toLowerCase().indexOf(search_qr) != -1
        );
      });
      setFilterData(filterDT);
    } else {
      setFilterData(poolList[[selected_chain]]);
    }
  };

  const getStatusData = async () => {
    if (account) {
      const provider = await connector.getProvider();
      const poolData = await getPoolData(
        provider,
        selectedItem["address"]
      );
      const weightA = fromWeiVal(provider, poolData["weights"][0]);
      setWeightA(weightA);
      setScale((weightA * 100).toPrecision(6));
      setTokenAAddr(poolData["tokens"][0]);
      setTokenBAddr(poolData["tokens"][1]);
      let amount = await getPoolBalance(
        account,
        provider,
        selectedItem["address"]
      );
      amount = Number(amount).toPrecision(6);
      setPoolAmount(amount);
      setValue(((amount * lpPercentage) / 100).toFixed(2));
      let totalLPAmount = await getPoolSupply(
        provider,
        selectedItem["address"]
      );
      setTotalLPTokens(totalLPAmount);
      await calculateOutput(totalLPAmount, (amount * lpPercentage) / 100);
    }
  }

  useEffect(() => {
    getStatusData();
  }, [selectedItem])

  const selectToken = async (item) => {
    handleClose();
    setSelectedItem(item);
  };

  const executeRemovePool = async () => {
    if (!(Number(value) <= 0 || Number(value) > poolAmount)) {
      const provider = await connector.getProvider();
      let amount1 = value * weightA;
      let amount2 = value * (1 - weightA);
      let ratio = (1 - scale / 100).toFixed(8);
      setRemoving(true);
      await removePool(
        account,
        provider,
        selectedItem["address"],
        value,
        ratio,
        tokenAAddr,
        tokenBAddr,
        contractAddresses[selected_chain]["router"]
      );
      setRemoving(false);
    }
  };

  const calculateOutput = async (totalLkTk, inValue) => {
    const provider = await connector.getProvider();
    const poolData = await getPoolData(
      provider,
      selectedItem["address"]
    );
    
    let removeingPercentage = inValue / (Number(totalLkTk) + 0.0000000001);
    let standardOutA = removeingPercentage * poolData.balances[0];
    let standardOutB = removeingPercentage * poolData.balances[1];

    // console.log("pool data", poolData, weightA)

    let reqWeightA = (1 - weightA) * 10 ** 18;
    let reqWeightB = weightA * 10 ** 18;

    let outB = 0;
    let outA = 0;
    if (reqWeightB < Number(poolData.weights[1])) {
      outB = (standardOutB / poolData.weights[1]) * reqWeightB;
      let extraA =
        calculateSwap(poolData.tokens[1], poolData, standardOutB - outB) *
        10 ** 18;
      outA = standardOutA + extraA;
    } else {
      outA = (standardOutA / poolData.weights[0]) * reqWeightA;
      let extraB =
        calculateSwap(poolData.tokens[0], poolData, standardOutA - outA) *
        10 ** 18;
      outB = standardOutB + extraB;
    }

    const vaueA = Math.floor(outA).toLocaleString("fullwide", { useGrouping: false });
    const vaueB = Math.floor(outB).toLocaleString("fullwide", { useGrouping: false });
    const amount1 = fromWeiVal(provider, vaueA);
    const amount2 = fromWeiVal(provider, vaueB);
    setOutTokenA(Number(amount1));
    setOutTokenB(Number(amount2));

  };

  const setInLimit = () => {
    let val = poolAmount.replace(",", "");
    setValue(Number(val));
    setLpPercentage(100);
  };


  useEffect(() => {
    if (account) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        const pData = await getPoolData(
          provider,
          selectedItem["address"]
        );
        const weightA = fromWeiVal(provider, pData["weights"][1]);
        setPoolData(pData);
        setWeightA(weightA);
        setScale((weightA * 100).toPrecision(6));
        setPrice(
          pData.balances[0] /
            pData.weights[0] /
            (pData.balances[1] / pData.weights[1])
        );
        setTokenAAddr(pData["tokens"][0]);
        setTokenBAddr(pData["tokens"][1]);
        let amount = await getPoolBalance(
          account,
          provider,
          selectedItem["address"]
        );
        let amount2 = await getPoolSupply(
          provider,
          selectedItem["address"]
        );
        amount = Number(amount).toPrecision(6);
        setTotalLPTokens(amount2);
        setPoolAmount(amount);
        // setValue(((amount * lpPercentage) / 100).toFixed(2));
        setPoolBalanceA(pData.balances[0]);
        setPoolBalanceB(pData.balances[1]);
        await calculateOutput(
          amount2,
          (amount * lpPercentage) / 100
        );
      };

      getInfo();
      const intervalId = setInterval(() => {
        getStatusData();
      }, 40000);
      return () => clearInterval(intervalId);
    }
  }, [account, value]);

  useEffect(() => {
    setFilterData(poolList[[selected_chain]]);
    selectToken(poolList[selected_chain][0]);
  }, [dispatch, selected_chain, account]);

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
          <h3 className="model-title mb-4">Remove Liquidity </h3>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <p className="capitalize text-grey-dark mr-1">
              Ratio {Number(scale).toPrecision(4)}% {selectedItem["symbols"][0]}{" "}
              - {(100 - scale).toPrecision(4)}% {selectedItem["symbols"][1]}
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
                  {Number(scale).toPrecision(4)}% {selectedItem["symbols"][0]}
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
                    {(100 - scale).toPrecision(4)}% {selectedItem["symbols"][1]}
                  </span>
                </button>
              </div>
            </div>
          )}
          <hr className="my-4" />
          <div className="w-full flex flex-col gap-y-6">
            <div>
              <div className="flex justify-between flex-col gap-y-2 items-center p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                <div className="flex flex-row w-full">
                  <div className="w-full">
                    <Button
                      variant="outlined"
                      startIcon={
                        <div style={{ float: "left" }}>
                          <img
                            src={selectedItem["logoURLs"][0]}
                            alt=""
                            style={{ float: "left" }}
                            className="w-5 sm:w-8"
                          />
                          <img
                            src={selectedItem["logoURLs"][1]}
                            alt=""
                            style={{ float: "left", marginLeft: -5 }}
                            className="w-5 sm:w-8"
                          />
                        </div>
                      }
                      onClick={handleOpen}
                      style={{ padding: "8px", fontSize: "13px" }}
                      className="w-36 sm:w-48"
                    >
                      {selectedItem["symbols"][0]} -{" "}
                      {selectedItem["symbols"][1]} LP
                    </Button>
                  </div>
                  <input
                    type="number"
                    value={value}
                    min={0}
                    onChange={handleValue}
                    disabled={true}
                    className="text-right input-value max-w-[300px] sm:max-w-none w-full text-right bg-transparent focus:outline-none"
                  />
                </div>
                <div className="text-right flex-1 w-full">
                  <p className="text-base text-grey-dark" onClick={setInLimit}>
                    LP Balance: {poolAmount}
                  </p>
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
                Recieve {selectedItem["symbols"][0]}
              </div>
              <div className="text-base text-light-primary dark:text-grey-dark flex-1">
                {outTokenB.toPrecision(6)}
              </div>
            </div>
            <div className="flex">
              <div className="text-base w-1/2 md:w-2/5 text-grey-dark">
                Recieve {selectedItem["symbols"][1]}
              </div>
              <div className="text-base text-light-primary dark:text-grey-dark flex-1">
                {outTokenA.toPrecision(6)}
              </div>
            </div>
          </div>
          <div className="">
          {account &&
            <button
              onClick={executeRemovePool}
              style={{ minHeight: 57 }}
              className={Number(value) == 0 || removing ? "btn-disabled rounded-sm font-bold w-full dark:text-black" : "btn-primary rounded-sm font-bold w-full dark:text-black"}
              disabled={Number(value) == 0 || removing}
            >
              {Number(value) == 0
                  ? "Insufficient Blanance"
                  :(removing?"Removing Liquidity":"Confirm")}
            </button>
          }
          {!account &&
            <button
              onClick={clickConWallet}
              style={{ minHeight: 57 }}
              className="btn-primary rounded-sm font-bold w-full dark:text-black"
            >
              {"Connect To Wallet"}
            </button>
          }
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            className={dark ? "dark" : ""}
          >
            <StyledModal className="bg-white-bg  dark:bg-dark-primary w-full">
              <h3 className="model-title mb-6">Remove Liquidity</h3>
              <TextField
                autoFocus={true}
                value={query}
                onChange={filterLP}
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
                      onClick={() => selectToken(item)}
                    >
                      <div className="relative flex">
                        <img src={item["logoURLs"][0]} alt="" />
                        <img
                          className="z-10 relative right-2"
                          src={item["logoURLs"][1]}
                          alt=""
                        />
                      </div>
                      <p className="text-light-primary text-lg">
                        {item["symbols"][0]} - {item["symbols"][1]} LP Token
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

export default RemoveLiquiditySimple;
