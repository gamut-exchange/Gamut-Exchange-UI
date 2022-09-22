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
} from "../../../config/web3";
import { uniList } from "../../../config/constants";
import { poolList } from "../../../config/constants";
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
  const [filterData, setFilterData] = useState(uniList[selected_chain]);
  const [limitedout, setLimitedout] = useState(false);
  const [swapFee, setSwapFee] = useState(0);
  const [middleToken, setMiddleToken] = useState(null);
  const [middleTokenSymbol, setMiddleTokenSymbol] = useState("");

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
  }

  const handleOpen = (val) => {
    setSelected(val);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleValue = async (event) => {
    let inLimBal = inBal.toString().replaceAll(",", "");
    let outLimBal = outBal.toString().replaceAll(",", "");
    if (Number(event.target.value) < inLimBal) setLimitedout(false);
    else setLimitedout(true);
    setInValue(event.target.value*1);
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
      selected_chain
    );
    setApproval(approval * 1 > val * 1);
  };

  const calculateSwap = async (inToken, poolData, input) => {
    let ammount = input * 10 ** 18;
    let balance_from;
    let balance_to;
    let weight_from;
    let weight_to;

    if (inToken.toLowerCase() == poolData.tokens[0].toLowerCase()) {
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

  const calcOutput = async (
    middleTokens,
    provider,
    val = inValue,
    inSToken = inToken,
    outSToken = outToken
  ) => {
    try {
      if (middleTokens.length === 1) {
        const poolAddressA = await getPoolAddress(
          provider,
          inSToken["address"],
          middleTokens[0]["address"],
          selected_chain
        );
        const poolDataA = await getPoolData(
          provider,
          poolAddressA,
          selected_chain
        );
        const poolAddressB = await getPoolAddress(
          provider,
          middleTokens[0]["address"],
          outSToken["address"],
          selected_chain
        );
        const poolDataB = await getPoolData(
          provider,
          poolAddressB,
          selected_chain
        );
        const middleOutput = await calculateSwap(
          inSToken["address"],
          poolDataA,
          val * (1 - swapFee)
        );
        const output = await calculateSwap(
          middleTokens[0]["address"],
          poolDataB,
          middleOutput * (1 - swapFee)
        );
        return output;
      } else {
        const poolAddressA = await getPoolAddress(
          provider,
          inSToken["address"],
          middleTokens[0]["address"],
          selected_chain
        );
        const poolDataA = await getPoolData(
          provider,
          poolAddressA,
          selected_chain
        );
        const poolAddressB = await getPoolAddress(
          provider,
          middleTokens[0]["address"],
          middleTokens[1]["address"],
          selected_chain
        );
        const poolDataB = await getPoolData(
          provider,
          poolAddressB,
          selected_chain
        );
        const poolAddressC = await getPoolAddress(
          provider,
          middleTokens[1]["address"],
          outSToken["address"],
          selected_chain
        );
        const poolDataC = await getPoolData(
          provider,
          poolAddressC,
          selected_chain
        );
        const middleOutput1 = await calculateSwap(
          inSToken["address"],
          poolDataA,
          val * (1 - swapFee)
        );
        const middleOutput2 = await calculateSwap(
          middleTokens[0]["address"],
          poolDataB,
          middleOutput1 * (1 - swapFee)
        );
        const output = await calculateSwap(
          middleTokens[1]["address"],
          poolDataC,
          middleOutput2 * (1 - swapFee)
        );
        return output;
      }
    } catch (error) {
      return -1;
    }
  };

  const findMiddleToken = async (inSToken, outSToken) => {
    const availableLists = uniList[selected_chain].filter((item) => {
      return (
        item["address"] !== inSToken["address"] &&
        item["address"] !== outSToken["address"]
      );
    });

    let suitableRouter = [];
    const provider = await connector.getProvider();
    for (let i = 0; i < availableLists.length; i++) {
      const calculatedOutput = await calcOutput(
        [availableLists[i]],
        provider,
        inValue,
        inSToken,
        outSToken
      );
      if (suitableRouter.length === 0) {
        if (Number(calculatedOutput) > 0) {
          suitableRouter[0] = [availableLists[i]];
          suitableRouter[1] = calculatedOutput;
        }
      } else {
        if (Number(calculatedOutput) > Number(suitableRouter[1])) {
          suitableRouter[0] = [availableLists[i]];
          suitableRouter[1] = calculatedOutput;
        }
      }
    }

    const allPairs = pairs(availableLists);
    for (let i = 0; i < allPairs.length; i++) {
      const calculatedOutput = await calcOutput(
        allPairs[i],
        provider,
        inValue,
        inSToken,
        outSToken
      );
      if (suitableRouter.length === 0) {
        if (Number(calculatedOutput) > 0) {
          suitableRouter[0] = allPairs[i];
          suitableRouter[1] = calculatedOutput;
        }
      } else {
        if (Number(calculatedOutput) > Number(suitableRouter[1])) {
          suitableRouter[0] = allPairs[i];
          suitableRouter[1] = calculatedOutput;
        }
      }
    }

    try {
      const poolAddress = await getPoolAddress(
        provider,
        inSToken["address"],
        outSToken["address"],
        selected_chain
      );
      const poolData = await getPoolData(provider, poolAddress, selected_chain);
      const result = await calculateSwap(inSToken["address"], poolData, inValue);
      if (suitableRouter.length !== 0) {
        if (Number(result) > Number(suitableRouter[1])) {
          setMiddleToken(null);
          getMiddleTokenSymbol(null);
          return null;
        } else {
          setMiddleToken(suitableRouter[0]);
          getMiddleTokenSymbol(suitableRouter[0]);
          return suitableRouter[0];
        }
      } else {
        setMiddleToken(null);
        getMiddleTokenSymbol(null);
        return null;
      }
    } catch (error) {
      if (suitableRouter.length !== 0) {
        setMiddleToken(suitableRouter[0]);
        getMiddleTokenSymbol(suitableRouter[0]);
        return suitableRouter[0];
      } else {
        return null;
      }
    }
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
      if (middleToken)
        await batchSwapTokens(
          provider,
          inToken["address"],
          outToken["address"],
          middleToken,
          inValue * 1,
          account,
          selected_chain
        );
      else
        swapTokens(
          provider,
          inToken["address"],
          outToken["address"],
          inValue * 1,
          account,
          limit,
          selected_chain
        );
    }
  };

  const approveTk = async () => {
    if (account) {
      const provider = await connector.getProvider();
      const approvedToken = await approveToken(
        account,
        provider,
        inToken["address"],
        inValue * 1.01,
        selected_chain
      );
      setApproval(approvedToken > inValue);
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
      const provider = await connector.getProvider();
        const midToken = await findMiddleToken(inToken, outToken);
        if (midToken) {
          let amountOut = await calcOutput(
            midToken,
            provider,
            value,
            inToken,
            outToken
          );
          amountOut =
            amountOut * 1 === 0
              ? 0
              : amountOut > 1
              ? amountOut.toFixed(2)
              : amountOut.toFixed(6);
          setValueEth(amountOut);
          if (midToken.length == 1) {
            const poolAddress1 = await getPoolAddress(
              provider,
              inToken["address"],
              midToken[0]["address"],
              selected_chain
            );
            const poolAddress2 = await getPoolAddress(
              provider,
              midToken[0]["address"],
              outToken["address"],
              selected_chain
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
              selected_chain
            );
            const poolAddress2 = await getPoolAddress(
              provider,
              midToken[0]["address"],
              midToken[1]["address"],
              selected_chain
            );
            const poolAddress3 = await getPoolAddress(
              provider,
              midToken[1]["address"],
              outToken["address"],
              selected_chain
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
            selected_chain
          );
          const poolData = await getPoolData(
            provider,
            poolAddress,
            selected_chain
          );
          let amountOut = await calculateSwap(
            inToken["address"],
            poolData,
            value
          );

          amountOut = (amountOut * 1 === 0) ? 0 : (amountOut > 1 ? amountOut.toFixed(2) : amountOut.toFixed(6));
          setValueEth(amountOut);
          const slippage = await calcSlippage(
            inToken,
            poolData,
            value,
            amountOut
          );
          setPoolAddress([poolAddress.toLowerCase()]);
        }
    } else if (inToken !== outToken) {
      for (var i = 0; i < poolList[selected_chain].length; i++) {
        if (
          (poolList[selected_chain][i]["symbols"][0] === inToken["symbol"] &&
            poolList[selected_chain][i]["symbols"][1] ===
              outToken["symbol"]) ||
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
          poolList[selected_chain][0]["address"],
          selected_chain
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
    }, 40000);
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

            {account &&
              <div className="mt-20 flex">
                {!approval && (
                  <>
                  {limitedout? (
                    <button style={{minHeight: 57}} className="btn-disabled font-bold w-full dark:text-black flex-1">
                      Insufficient Balance
                    </button>
                  ) : 
                  <>
                    <button
                      onClick={approveTk}
                      style={{ minHeight: 57 }}
                      className={
                        approval
                          ? "btn-primary font-bold w-full dark:text-black flex-1"
                          : "btn-primary font-bold w-full dark:text-black flex-1 mr-2"
                      }
                    >
                      {" "}
                      Approval{" "}
                    </button>
                    <button
                    onClick={executeSwap}
                    style={{ minHeight: 57 }}
                    className={
                      approval
                        ? "btn-primary font-bold w-full dark:text-black flex-1"
                        : "btn-primary font-bold w-full dark:text-black flex-1 ml-2"
                    }
                    disabled={limitedout}
                  >
                    {" "}
                    {limitedout ? "Not Enough Token" : "Confirm"}
                  </button>
                  </>
                  }
                </>                
              )}
              </div>
            }
            {!account &&
              <div className="mt-20 flex">
                <button
                  onClick={clickConWallet}
                  style={{ minHeight: 57 }}
                  className="btn-primary font-bold w-full dark:text-black flex-1"
                >
                  {"Connect To Wallet"}
                </button>
              </div>
            }
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
