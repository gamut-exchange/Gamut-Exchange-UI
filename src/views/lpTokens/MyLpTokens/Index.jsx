import React from "react";
import MyLpTokens from "./MyLpTokens";

const MyLpTokensTab = () => {
  return (
    <div>
      <div className="py-6 border-b border-white mb-7">
        <h3 className="model-title mb-4">My LP Tokens</h3>
        <p className="desc-small">
          You can provide liquidity in any ratio for the pairs.{" "}
          <a href="learn more"> Learn more </a>
        </p>
      </div>

      <div>
        <MyLpTokens />
      </div>
    </div>
  );
};

export default MyLpTokensTab;
