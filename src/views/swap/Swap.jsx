import React, { useState } from "react";
import AdvanceSwap from "./AdvanceMode/AdvanceSwap";
import SimpleSwap from "./SimpleMode/SimpleSwap";

const Swap = () => {
  const [advance, setAdvance] = useState(false);

  const handleMode = () => {
    setAdvance(!advance);
  };

  return (
    <>
      <div className="bg-white-bg dark:bg-dark-primary">
        <div className="py-8 border-b border-grey-dark dark:border-grey-light bg-white-bg dark:bg-dark-primary dark:bg-opacity-95">
          <h2 className="title-secondary main-container">Swap</h2>
        </div>
        <div className="main-container">
          <div className="py-6 border-b border-grey-dark">
            <h3 className="model-title mb-4">Sided Pairs</h3>
            <p className="desc-small">
              You can provide liquidity in any ratio for the pairs.
              <a href="learn more">
                {" "}
                <span className="text-light-primary text-lg"> Learn more</span>
              </a>
            </p>
          </div>
          <hr className="mb-10" />

          <div>
            {!advance ? (
              <SimpleSwap handleMode={handleMode} />
            ) : (
              <AdvanceSwap handleMode={handleMode} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Swap;
