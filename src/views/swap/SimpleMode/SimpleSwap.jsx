import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import tw, { styled } from "twin.macro";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTokenPricesData } from "../../../config/chartData";
import { AiOutlineArrowDown, AiOutlineLineChart } from "react-icons/ai";
import { ImLoop } from "react-icons/im";
import {
  getTokenBalance,
  getPoolAddress,
  getPoolData,
  swapTokens,
  batchSwapTokens,
  tokenApproval,
  approveToken,
  getSwapFeePercent,
  calculateSwap,
  calcOutput,
  getMiddleToken
} from "gamut-sdk";
import { uniList } from "../../../config/constants";
import { poolList } from "../../../config/constants";
import { contractAddresses } from "../../../config/constants";
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

import "./SimpleSwap.css";

const SimpleSwap = ({ dark }) => {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [inValue, setInValue] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [query, setQuery] = useState("");
  const [valueEth, setValueEth] = useState(0);
  const [poolAddress, setPoolAddress] = useState([]);
  const [inToken, setInToken] = useState(uniList[selected_chain][0]);
  const [outToken, setOutToken] = useState(uniList[selected_chain][1]);
  const [inBal, setInBal] = useState(0);
  const [outBal, setOutBal] = useState(0);
  const [valSlipage, setValSlipage] = useState(0);
  const [fee, setFee] = useState(0);
  const [chartOpen, setChartOpen] = useState(false);
  const [approval, setApproval] = useState(false);
  const [approvedVal, setApprovedVal] = useState(0);
  const [filterData, setFilterData] = useState(uniList[selected_chain]);
  const [limitedout, setLimitedout] = useState(false);
  const [swapFee, setSwapFee] = useState(0);
  const [middleToken, setMiddleToken] = useState(null);
  const [middleTokenSymbol, setMiddleTokenSymbol] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const dispatch = useDispatch();
  const pricesData = useTokenPricesData(poolAddress);
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
  };

  const handleOpen = (val) => {
    setSelected(val);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleValue = async (event) => {
    setInValue(event.target.value * 1);
    setFee(event.target.value * swapFee);
    checkApproved(inToken, event.target.value);
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

  const checkApproved = async (token, val) => {
    const provider = await connector.getProvider();
    const approval = await tokenApproval(
      account,
      provider,
      token["address"],
      contractAddresses[selected_chain]["router"]
    );
    
    setApproval(approval * 1 >= val * 1);
    setApprovedVal(Number(approval));
  };

  const calcSlippage = async (inToken, poolData, input, output) => {
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
    let priceTrade = input / output;

    let slip = (1 - pricePool / priceTrade) * 100;

    return slip;
  };

  const selectToken = async (token, selected) => {
    handleClose();
    var bal = 0;
    if (selected === 0) {
      if (token["address"] !== inToken["address"]) {
        setInToken(token);
      }
    } else if (selected == 1) {
      if (token["address"] !== outToken["address"]) {
        setOutToken(token);
      }
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
        checkApproved(token, inValue);

        let inLimBal = bal.toString().replaceAll(",", "");
        let outLimBal = outBal.toString().replaceAll(",", "");
        if (
          Number(inValue) <= Number(inLimBal) &&
          Number(valueEth) <= Number(outLimBal)
        )
          setLimitedout(false);
        else setLimitedout(true);
      } else if (selected == 1) {
        setOutBal(bal);
        let tempData = uniList[selected_chain].filter((item) => {
          return item["address"] !== token["address"];
        });

        setFilterData(tempData);
      }
    }
  };

  const reverseToken = async () => {
    let tempToken = outToken;
    await selectToken(inToken, 1);
    await selectToken(tempToken, 0);
  };

  const findMiddleToken = async () => {
    const provider = await connector.getProvider();
    var suitableRouter = await getMiddleToken(inValue, inToken, outToken, uniList[selected_chain], provider, contractAddresses[selected_chain]["hedgeFactory"], swapFee);
    setMiddleToken(suitableRouter);
    getMiddleTokenSymbol(suitableRouter);
    return suitableRouter;
  };

  const pairs = (arr) => {
    return arr.flatMap((x) => {
      return arr.flatMap((y) => {
        return x["address"] != y["address"] ? [[x, y]] : [];
      });
    });
  };

  const executeSwap = async () => {
    if (account && inToken["address"] !== outToken["address"]) {
      const provider = await connector.getProvider();
      const limit = valueEth * 0.99;
      setSwapping(true);
      if (middleToken)
        await batchSwapTokens(
          provider,
          inToken["address"],
          outToken["address"],
          middleToken,
          inValue * 1,
          account,
          contractAddresses[selected_chain]["router"]
        );
      else
        await swapTokens(
          provider,
          inToken["address"],
          outToken["address"],
          inValue * 1,
          account,
          limit,
          contractAddresses[selected_chain]["router"]
        );
      setSwapping(false);
    }
  };

  const approveTk = async (amount) => {
    if (account) {
      const provider = await connector.getProvider();
      setUnlocking(true);
      const approvedToken = await approveToken(
        account,
        provider,
        inToken["address"],
        amount * 1.01,
        contractAddresses[selected_chain]["router"]
      );
      setUnlocking(false);
      setApproval(approvedToken >= inValue);
    }
  };

  const setInLimit = () => {
    if (inBal) {
      let val = inBal.toString().replaceAll(",", "");
      setInValue(Number(val));
      setLimitedout(false);
    }
  };

  const getMiddleTokenSymbol = (tokens) => {
    if (tokens) {
      if (tokens.length == 2) {
        const result1 = uniList[selected_chain].filter((item) => {
          return item.address === tokens[0]["address"];
        });

        const result2 = uniList[selected_chain].filter((item) => {
          return item.address === tokens[1]["address"];
        });

        setMiddleTokenSymbol([result1[0].symbol, result2[0].symbol]);
      } else {
        const result1 = uniList[selected_chain].filter((item) => {
          return item.address === tokens[0]["address"];
        });

        setMiddleTokenSymbol([result1[0].symbol]);
      }
    } else {
      setMiddleTokenSymbol(["", ""]);
    }
  };

  const getStatusData = async (value) => {
    if (account && inToken !== outToken) {
      let inLimBal = inBal.toString().replaceAll(",", "");
      let outLimBal = outBal.toString().replaceAll(",", "");
      const provider = await connector.getProvider();
      const midToken = await findMiddleToken();
      if (midToken) {
        if(value*1 != 0) {
          let amountOut = await calcOutput(
            midToken,
            provider,
            value,
            inToken,
            outToken,
            contractAddresses[selected_chain]["hedgeFactory"],
            swapFee
          );
          amountOut =
            amountOut * 1 === 0
              ? 0
              : amountOut > 1
              ? amountOut.toFixed(2)
              : amountOut.toFixed(6);
          setValueEth(amountOut);
          if (Number(value) > Number(inLimBal) || Number(amountOut) > Number(outLimBal)) setLimitedout(true);
          else setLimitedout(false);
        }
        if (midToken.length == 1) {
          const poolAddress1 = await getPoolAddress(
            provider,
            inToken["address"],
            midToken[0]["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          const poolAddress2 = await getPoolAddress(
            provider,
            midToken[0]["address"],
            outToken["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          setPoolAddress([
            poolAddress1.toLowerCase(),
            poolAddress2.toLowerCase(),
          ]);
        } else {
          const poolAddress1 = await getPoolAddress(
            provider,
            inToken["address"],
            midToken[0]["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          const poolAddress2 = await getPoolAddress(
            provider,
            midToken[0]["address"],
            midToken[1]["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          const poolAddress3 = await getPoolAddress(
            provider,
            midToken[1]["address"],
            outToken["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          setPoolAddress([
            poolAddress1.toLowerCase(),
            poolAddress2.toLowerCase(),
            poolAddress3.toLowerCase(),
          ]);
        }
      } else {

        const poolAddress = await getPoolAddress(
          provider,
          inToken["address"],
          outToken["address"],
          contractAddresses[selected_chain]["hedgeFactory"]
        );
        const poolData = await getPoolData(
          provider,
          poolAddress
        );

        if(value*1 != 0) {
          let amountOut = await calculateSwap(
            inToken["address"],
            poolData,
            value
          );

          amountOut =
            amountOut * 1 === 0
              ? 0
              : amountOut > 1
              ? amountOut.toFixed(2)
              : amountOut.toFixed(6);
          setValueEth(amountOut);
          if (Number(value) > Number(inLimBal) || Number(amountOut) > Number(outLimBal)) setLimitedout(true);
          else setLimitedout(false);

          const slippage = await calcSlippage(
            inToken,
            poolData,
            value,
            amountOut
          );
        }

        setPoolAddress([poolAddress.toLowerCase()]);
      }
    } else if (inToken !== outToken) {
      for (var i = 0; i < poolList[selected_chain].length; i++) {
        if (
          (poolList[selected_chain][i]["symbols"][0] === inToken["symbol"] &&
            poolList[selected_chain][i]["symbols"][1] === outToken["symbol"]) ||
          (poolList[selected_chain][i]["symbols"][1] === inToken["symbol"] &&
            poolList[selected_chain][i]["symbols"][0] === outToken["symbol"])
        ) {
          setPoolAddress([
            poolList[selected_chain][i]["address"].toLowerCase(),
          ]);
          break;
        }
      }
    } else {
      setPoolAddress([]);
    }
  };

  useEffect(() => {
    if (account) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        let inBal = await getTokenBalance(
          provider,
          inToken["address"],
          account
        );
        let outBal = await getTokenBalance(
          provider,
          outToken["address"],
          account
        );
        setInBal(inBal);
        setOutBal(outBal);
        checkApproved(inToken, inValue);
        const swapFeePercent = await getSwapFeePercent(
          provider,
          poolList[selected_chain][0]["address"]
        );
        setSwapFee(swapFeePercent * 0.01);
      };
      getInfo();
    }
  }, [account, ""]);

  useEffect(() => {
    getStatusData(inValue);
    const intervalId = setInterval(() => {
      getStatusData(inValue);
    }, 120000);
    return () => clearInterval(intervalId);
  }, [inToken, outToken, inValue]);

  useEffect(() => {
    setFilterData(uniList[selected_chain]);
    selectToken(uniList[selected_chain][0], 0);
    selectToken(uniList[selected_chain][1], 1);
  }, [dispatch, selected_chain]);

  const CustomTooltip = ({ active, payload, label }) => {
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
            1 {inToken["symbol"]} = {payload[0].payload["value"]}{" "}
            {outToken["symbol"]}
          </p>
        </div>
      );
    }

    return null;
  };

  const formattedPricesData = useMemo(() => {
    if (pricesData && pricesData.prices) {
      var result = [];
      const poolTokenPrices = pricesData.prices;
      if (poolAddress.length === 1) {
        poolTokenPrices.map((item, index) => {
          if (item.token0.symbol === inToken["symbol"]) {
            if (Number(item.token0Price) > 0.1)
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token0Price).toFixed(2) * 1,
              });
            else if (Number(item.token0Price) > 0.001)
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token0Price).toFixed(4) * 1,
              });
            else if (Number(item.token0Price) > 0.00001)
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token0Price).toFixed(6) * 1,
              });
            else
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token0Price).toFixed(8) * 1,
              });
          } else {
            if (Number(item.token1Price) > 0.1)
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token1Price).toFixed(2) * 1,
              });
            else if (Number(item.token1Price) > 0.001)
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token1Price).toFixed(4) * 1,
              });
            else if (Number(item.token1Price) > 0.00001)
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token1Price).toFixed(6) * 1,
              });
            else
              result.push({
                name: index,
                timestamp: item.timestamp,
                value: Number(item.token1Price).toFixed(8) * 1,
              });
          }
        });
      } else if (poolAddress.length === 2) {
        for (var i = 1; i < poolTokenPrices.length; i++) {
          if (poolTokenPrices[i].pool.id === poolAddress[0]) {
            for (var j = i - 1; j >= 0; j--)
              if (poolTokenPrices[j].pool.id === poolAddress[1]) {
                var tempPrice =
                  poolTokenPrices[i].token0.symbol === inToken["symbol"]
                    ? poolTokenPrices[i].token0Price
                    : poolTokenPrices[i].token1Price;
                var lastPrice =
                  poolTokenPrices[j].token0.symbol === outToken["symbol"]
                    ? tempPrice * poolTokenPrices[j].token1Price
                    : tempPrice * poolTokenPrices[j].token0Price;
                if (Number(lastPrice) > 0.1)
                  result.push({
                    name: i,
                    timestamp: poolTokenPrices[i].timestamp,
                    value: Number(lastPrice).toFixed(2) * 1,
                  });
                else if (Number(lastPrice) > 0.001)
                  result.push({
                    name: i,
                    timestamp: poolTokenPrices[i].timestamp,
                    value: Number(lastPrice).toFixed(4) * 1,
                  });
                else if (Number(lastPrice) > 0.00001)
                  result.push({
                    name: i,
                    timestamp: poolTokenPrices[i].timestamp,
                    value: Number(lastPrice).toFixed(6) * 1,
                  });
                else
                  result.push({
                    name: i,
                    timestamp: poolTokenPrices[i].timestamp,
                    value: Number(lastPrice).toFixed(8) * 1,
                  });
                break;
              }
          }
        }
      } else if (poolAddress.length === 3) {
        for (var i = 2; i < poolTokenPrices.length; i++) {
          if (poolTokenPrices[i].pool.id === poolAddress[0]) {
            var tempArr = [];
            for (var j = i - 1; j >= 0; j--)
              if (
                poolTokenPrices[j].pool.id === poolAddress[1] ||
                poolTokenPrices[j].pool.id === poolAddress[2]
              ) {
                if (tempArr.length === 0) tempArr.push(poolTokenPrices[j]);
                else if (tempArr[0].pool.id !== poolTokenPrices[j].pool.id) {
                  if (poolTokenPrices[j].pool.id === poolAddress[1]) {
                    var tempPrice1 =
                      poolTokenPrices[i].token0.symbol === inToken["symbol"]
                        ? poolTokenPrices[i].token0Price
                        : poolTokenPrices[i].token1Price;
                    var tempPrice2 =
                      poolTokenPrices[j].token0.symbol ===
                        poolTokenPrices[i].token0.symbol ||
                      poolTokenPrices[j].token0.symbol ===
                        poolTokenPrices[i].token1.symbol
                        ? poolTokenPrices[j].token0Price * tempPrice1
                        : poolTokenPrices[j].token1Price * tempPrice1;
                    var lastPrice =
                      tempArr[0].token0.symbol === outToken["symbol"]
                        ? tempPrice2 * tempArr[0].token0Price
                        : tempPrice2 * tempArr[0].token1Price;
                    if (Number(lastPrice) > 0.1)
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(2) * 1,
                      });
                    else if (Number(lastPrice) > 0.001)
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(4) * 1,
                      });
                    else if (Number(lastPrice) > 0.00001)
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(6) * 1,
                      });
                    else
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(8) * 1,
                      });
                    break;
                  } else {
                    var tempPrice1 =
                      poolTokenPrices[i].token0.symbol === inToken["symbol"]
                        ? poolTokenPrices[i].token0Price
                        : poolTokenPrices[i].token1Price;
                    var tempPrice2 =
                      tempArr[0].token0.symbol ===
                        poolTokenPrices[i].token0.symbol ||
                      tempArr[0].token0.symbol ===
                        poolTokenPrices[i].token1.symbol
                        ? tempArr[0].token0Price * tempPrice1
                        : tempArr[0].token1Price * tempPrice1;
                    var lastPrice =
                      poolTokenPrices[j].token0.symbol === outToken["symbol"]
                        ? tempPrice2 * poolTokenPrices[j].token0Price
                        : tempPrice2 * poolTokenPrices[j].token1Price;
                    if (Number(lastPrice) > 0.1)
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(2) * 1,
                      });
                    else if (Number(lastPrice) > 0.001)
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(4) * 1,
                      });
                    else if (Number(lastPrice) > 0.00001)
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(6) * 1,
                      });
                    else
                      result.push({
                        name: i,
                        timestamp: poolTokenPrices[i].timestamp,
                        value: Number(lastPrice).toFixed(8) * 1,
                      });
                    break;
                  }
                }
              }
          }
        }
      }
      return result;
    } else {
      return [];
    }
  }, [pricesData]);

  return (
    <div className="flex flex-col">
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
      <div className="flex sm:flex-row flex-col items-center">
        {chartOpen && (
          <div className="flex-1 w-full mb-4">
            {formattedPricesData[0] && (
              <h3 className="model-title mb-4" style={{ fontSize: 18 }}>
                <b>
                  {inToken["symbol"]}/{outToken["symbol"]}
                </b>{" "}
                Price Chart
              </h3>
            )}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                width={500}
                height={200}
                data={formattedPricesData}
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
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  strokeWidth={2}
                />
                <Brush />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="max-w-2xl mx-auto pb-16 flex-1">
          <div className="bg-white-bg  dark:bg-dark-primary py-6 rounded shadow-box border p-6 border-grey-dark ">
            <div className="w-full flex flex-col gap-y-6">
              <div>
                <h3 className="input-lable mb-4">Input</h3>
                <div className="flex flex-wrap flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                  <div className="flex flex-row w-full">
                    <div className="w-full">
                      <Button
                        id="address_in"
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
                      value={inValue}
                      min={0}
                      onChange={handleValue}
                      className="input-value text-lg text-right w-full bg-transparent focus:outline-none"
                    ></input>
                  </div>
                  <div className="text-right flex-1 w-full">
                    <p
                      className="text-base text-grey-dark"
                      onClick={setInLimit}
                    >
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
                <div className="flex flex-wrap flex-col justify-between sm:items-center p-2 sm:p-4 rounded-sm bg-grey-dark bg-opacity-30 dark:bg-off-white dark:bg-opacity-10">
                  <div className="flex flex-row w-full">
                    <div className="w-full">
                      <Button
                        id="address_out"
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
                      readOnly={true}
                      className="input-value text-lg text-right w-full bg-transparent focus:outline-none"
                    ></input>
                  </div>
                  <div className="text-right flex-1 w-full">
                    <p className="text-base text-grey-dark">
                      Balance: {outBal}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <p className="text-grey-dark">Slippage {valSlipage}%</p>
              {middleToken && middleToken.length == 2 && (
                <p className="text-light-primary">
                  {inToken.symbol} -> {middleTokenSymbol[0]} ->{" "}
                  {middleTokenSymbol[1]} -> {outToken.symbol}
                </p>
              )}
              {middleToken && middleToken.length == 1 && (
                <p className="text-light-primary">
                  {inToken.symbol} -> {middleTokenSymbol[0]} ->{" "}
                  {outToken.symbol}
                </p>
              )}
              {!middleToken && (
                <p className="text-light-primary">
                  {inToken.symbol} -> {outToken.symbol}
                </p>
              )}
              <p className="text-light-primary">
                Fee: {fee} {inToken.symbol}
              </p>
            </div>
            {account && (
              <div className="mt-10">
                {limitedout || Number(inValue)==0 ? (
                  <button
                    style={{ minHeight: 57 }}
                    className="btn-disabled font-bold w-full dark:text-black flex-1"
                  >
                    Insufficient Balance
                  </button>
                ) : (
                  <>
                    {approval ? (
                      <button
                        onClick={executeSwap}
                        style={{ minHeight: 57 }}
                        className={
                          swapping
                            ? "btn-disabled font-bold w-full dark:text-black flex-1"
                            : "btn-primary font-bold w-full dark:text-black flex-1"
                        }
                        disabled={swapping}
                      >
                        {swapping?"Swap in progress":"Swap Now"}
                      </button>
                    ) : (
                      <>
                        <div className="flex">
                          <button
                            onClick={() =>
                              approveTk(Number(inValue - approval))
                            }
                            style={{ minHeight: 57 }}
                            className={
                              approval
                                ? "btn-primary font-bold w-full dark:text-black flex-1"
                                : ((limitedout || unlocking)?"btn-disabled font-bold w-full dark:text-black flex-1 mr-2":"btn-primary font-bold w-full dark:text-black flex-1 mr-2")
                            }
                            disabled={limitedout || unlocking}
                          >
                            {unlocking?"Unlocking...":"Unlock "+Math.ceil(inValue - approvedVal)+" "+inToken["value"]}
                          </button>
                          <button
                            onClick={() => approveTk(9999999999)}
                            style={{ minHeight: 57 }}
                            className={
                              approval
                                ? "btn-primary font-bold w-full dark:text-black flex-1"
                                : ((limitedout || unlocking)?"btn-disabled font-bold w-full dark:text-black flex-1 mr-2":"btn-primary font-bold w-full dark:text-black flex-1 mr-2")
                            }
                            disabled={limitedout || unlocking}
                          >
                            {unlocking?"Unlocking...":"Infinite Unlock"}
                          </button>
                        </div>
                        <div className="text-red-700 flex items-center pt-1.5">
                          <div>
                            <svg
                              className="fill-current h-6 w-6 mr-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                            </svg>
                          </div>
                            <p className="text-small">
                              To proceed swapping, please unlock{" "}
                              {inToken["value"].toUpperCase()} first.
                            </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            {!account && (
              <div className="mt-20 flex">
                <button
                  onClick={clickConWallet}
                  style={{ minHeight: 57 }}
                  className="btn-primary font-bold w-full dark:text-black flex-1"
                >
                  {"Connect To Wallet"}
                </button>
              </div>
            )}
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
                <ul className="flex flex-col gap-y-2">
                  {filterData.map((item) => {
                    const { address, logoURL, symbol } = item;
                    return (
                      <li
                        key={address}
                        className="flex gap-x-1 thelist"
                        onClick={() => selectToken(item, selected)}
                      >
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
    </div>
  );
};

export default SimpleSwap;
