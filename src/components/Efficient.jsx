import React, { useState } from "react";

const Efficient = () => {
  const [liquidity, setLiquidity] = useState(0);
  const [price, setPrice] = useState(0);
  const [regular, setRegular] = useState(0);
  const [gamut, setGamut] = useState(0);
  const [edge , setEdge] = useState(0);

  const handleliq = (e) => {
    setLiquidity(e.target.value);
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const calculation = () => {
    let amountIn = parseInt(liquidity);
    let x = parseInt(price);
    console.log(amountIn, x, "amount, x");
    let changeP = 0;

    if (amountIn < 1){
      setLiquidity(100)
      amountIn = 100
    }

    if (x < -99){
      x = -99
      setPrice(-99)
    }

    if (x < 0) {
      let y = x + 100;
      let cN = (1 / (y / 100) - 1) * 100;
      changeP = cN;
    } else {
      changeP = x;
    }

    let pbA = amountIn / 2; //pool balance A
    let pbB = pbA; //pool balance B
    let k = pbA * pbB; //K of Pool
    let spbA = pbA; //start value pool balance A
    let spbB = pbB; //start value pool balance B
    let wA = 0.5;
    let wB = 0.5;
    let priceA = 1;
    // let amm_Value = 0;
    let hodl_Value = 0;
    // let aamm_Value = 0;
    let aamm_edge = 0;
    let amm_Value = 0;
    let aamm_Value = 0;
    let bIn = 0;

    while (priceA < changeP / 100 + 1) {
      //AAMM Swap
      console.log(pbB, "pbB before");
      if (priceA > changeP / 100 + 1 - priceA / 25) {
        bIn = pbB * 0.00005;
      } else {
        bIn = pbB * 0.01;
      }
      console.log(bIn);
      let exp =
        (wB - (wB * (1 - pbB / (pbB + bIn))) / (1 + pbB / (pbB + bIn))) /
        (wA + (wB * (1 - pbB / (pbB + bIn))) / (1 + pbB / (pbB + bIn)));
      console.log(exp);
      let bOut = pbA * (1 - (pbB / (pbB + bIn)) ** exp);
      //Weight Adjustment
      wB = wB - ((pbA / (pbA - bOut) - 1) * (1 - wA)) / (1 + wA / wB);
      wA = 1-wB;
      
      // Pool Balance Adjustment
      pbA -= bOut;
      pbB += bIn;
      // calc price
      priceA = pbB / wB / (pbA / wA);
      let priceB = 1;

      let amm_bA = Math.sqrt(k) / Math.sqrt(priceA);
      let amm_bB = Math.sqrt(k) * Math.sqrt(priceA);

      console.log(pbA, "pbA");
      console.log(pbB, "pbB");
      console.log(bOut, "bOut");
      console.log(wA, "wA")
      console.log(wB, "wB")
      console.log(amm_bB, "amm bb");

      if (x > 0) {
        amm_Value = amm_bA * priceA * 2;
        hodl_Value = spbA * priceA + spbB;
        aamm_Value = pbA * priceA + pbB * priceB;
        aamm_edge = ((1 / amm_Value) * aamm_Value - 1) * 100;
      } else {
        amm_Value = amm_bA * priceB * 2;
        hodl_Value = spbA * (1 / priceA) + spbB;
        aamm_Value = pbA * priceB + pbB * (1 / priceA);
        aamm_edge = ((1 / amm_Value) * aamm_Value - 1) * 100;
      }
      setRegular(amm_Value);
      setGamut(aamm_Value);
      setEdge(aamm_edge);
      console.log(hodl_Value, "hodle value");
      console.log(aamm_edge, "aamm_edge");
      console.log(aamm_Value);
      // text +=
      //   "<br>AMM:" +
      //   amm_Value.toFixed(2) +
      //   "   AAMM:" +
      //   aamm_Value.toFixed(2) +
      //   "   price;" +
      //   priceA.toFixed(2) +
      //   "   Gamut Edge:" +
      //   aamm_edge.toFixed(4) +
      //   "%";
      // i++;
    }
  };
  return (
    <div className="py-[69px] bg-white dark:bg-dark-primary">
      <div className="main-container">
        <div className="flex md:flex-row justify-center items-center flex-col gap-y-8 gap-x-8">
          <div className="md:text-left text-center">
            <h2 className="title-secondary">Provably Efficient </h2>
            <p className="desc">
              Gamut Exchange uses customized algorithms to calculate internal
              incentives and maximize the mutual value between ecosystem
              participants.
              <br />
              <br />
              Compare and contrast the relative benefits of different liquidity
              positions in different scenarios using our complimentary
              calculator!
            </p>
          </div>
          <div
            style={{ maxWidth: 380 }}
            className="p-6 shadow-box border w-full border-light-primary rounded"
          >
            <h3 className="model-title text-center ">
              AMM/AAMM Value Calculator
            </h3>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-4">
              <div className="bg-white-bg dark:bg-grey-dark dark:bg-opacity-30 p-4 w-full flex items-center justify-between">
                <div className="flex-1">
                  <p className="input-title  dark:text-grey-dark">
                    Your Provided Liquidty
                  </p>
                </div>
                <div className="flex-1">
                  <input
                    type={`text`}
                    value={liquidity}
                    onChange={handleliq}
                    className="input-title appearance-none dark:text-grey-dark w-full text-right  bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div className="bg-white-bg dark:bg-grey-dark dark:bg-opacity-30 p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="input-title dark:text-grey-dark">
                    Price Change in %
                  </p>
                </div>
                <div className="flex-1">
                  <input
                    type={`text`}
                    value={price}
                    onChange={handlePrice}
                    className="input-title dark:text-grey-dark w-full text-right  bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div className="bg-grey-dark p-4 flex items-center justify-between">
                <p className="input-title dark:text-dark-primary">
                  Regular Automatet Market Maker
                </p>
                <span className="input-title dark:text-dark-primary">
                  {regular.toFixed(2)}
                </span>
              </div>
              <div className="bg-grey-dark p-4 flex items-center justify-between">
                <p className="input-title dark:text-dark-primary">
                  Gamut Automatet Market Maker
                </p>
                <span className="input-title dark:text-dark-primary" style={{fontWeight: "bold", color: "green"}}>
                  +{edge.toFixed(2)}%
                </span>
                <span className="input-title dark:text-dark-primary" >
                  {gamut.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={calculation}
              className="w-full text-light-primary dark:text-grey-dark py-2 mt-4"
            >
              Calculate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Efficient;
