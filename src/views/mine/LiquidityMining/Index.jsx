import React, { useState } from "react";
import ChartCards from "../../../components/ChartCards";
import ClaimAll from "./ClaimAll";
import LiquidityPools from "./LiquidityPools";

const LiquidityMining = () => {
  const [advance, setAdvance] = useState(false);
  const handleMode = () => {
    setAdvance(!advance);
  };
  return (
    <div>
      <div className="py-6 border-b border-white mb-7">
        <h3 className="model-title mb-4">Performance</h3>
        <p className="desc-small">
          You can claim your rewards view the performance of all your LP tokens{" "}
          <a href="learn more"> </a>
        </p>
      </div>

      <div>
        <ChartCards cards={chart} />
        <ClaimAll />
        <LiquidityPools handleMode={handleMode} />
      </div>
    </div>
  );
};

export default LiquidityMining;

const chart = [
  { id: 1, title: "REWARDS", value: "$1020.00", label: "89 $GMT" },
  { id: 2, title: "DAILY REVENUE", value: "$68.00", label: "4 $GMT" },
  { id: 3, title: "APR", value: "172%", label: "" },
  { id: 4, title: "DAILY GMT BUYBACK", value: "$68.00", label: "4 $GMT" },
];
