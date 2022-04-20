import React, { useState } from "react";
import AdvanceSwap from "./AdvanceMode/AdvanceSwap";
import SimpleSwap from "./SimpleMode/SimpleSwap";

const Swap = ({dark}) => {

  return (
    <>
      <div className="bg-white-bg dark:bg-dark-primary">
        <div className="main-container">
         
          <hr className="mb-10" />
          <div>
            <SimpleSwap dark={dark} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Swap;
