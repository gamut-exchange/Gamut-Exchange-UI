import React, { useState } from "react";
import AdvanceSwap from "./AdvanceMode/AdvanceSwap";
import SimpleSwap from "./SimpleMode/SimpleSwap";

const Swap = () => {

  return (
    <>
      <div className="bg-white-bg dark:bg-dark-primary">
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
            <SimpleSwap />
          </div>
        </div>
      </div>
    </>
  );
};

export default Swap;
