import React, { useState } from "react";
import AddLiquidityAdvance from "../../components/advanceMode/AddLiquidityAdvance";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { ImLoop } from "react-icons/im";
import AddLiquiditySimple from "../../components/simpleMode/AddLiquiditySimple";
import RemoveLiquiditySimple from "../../components/simpleMode/RemoveLiquiditySimple";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


const Liquidity = () => {

  const [tab, setTab] = useState(0);

  const handleTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div className="">
      <div className="bg-white-bg dark:bg-dark-primary">
        <div className="main-container">
          <div className="py-6 border-b border-grey-dark">
              <h3 className="model-title mb-4">Sided Pairs</h3>
              <p className="desc-small">
                You can provide liquidity in any ratio for the pairs.
                <a href="learn more">
                  {" "}
                  <span className="text-light-primary text-lg">
                    {" "}
                    Learn more
                  </span>
                </a>
              </p>
            </div>

            <div className="max-w-2xl mx-auto py-8">
                <div className="flex justify-between mb-10">
                  <Tabs value={tab} onChange={handleTab}>
                    <Tab label="Add Lp" style={{color:'cornflowerblue'}} className="text-dark-primary dark:text-gray-300" />
                    <Tab label="Remove lp" style={{color:'cornflowerblue'}} className="text-dark-primary dark:text-gray-300" />
                  </Tabs>
                </div>
                <TabPanel value={tab} index={0}>
                  <AddLiquiditySimple />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <RemoveLiquiditySimple />
                </TabPanel>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Liquidity;
