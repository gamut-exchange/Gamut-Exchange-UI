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
import LiquidityMining from "./LiquidityMiningTab/Index";
import GntLockTab from "./GntLockTab/Index";
import MyLpTokensTab from "./MyLpTokensTab/Index";

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
const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {},
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(() => ({
  maxWidth: 175,
  width: "100%",
  border: "1px solid",
  borderColor: "#BFC6D1",

  "&.Mui-selected": {
    backgroundColor: "#BFC6D1",
    border: "1px solid",
    borderColor: "#BFC6D1",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Liquidity = () => {
  const [value, setValue] = useState(0);
  const [tab, setTab] = useState(0);
  const [advance, setAdvance] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleTab = (event, newValue) => {
    setTab(newValue);
  };
  const handleMode = () => {
    setAdvance(!advance);
  };

  return (
    <div className="">
      <div className="py-8 border-b border-grey-dark dark:border-grey-light bg-white-bg dark:bg-dark-primary dark:bg-opacity-95">
        <div className="main-container">
          <h2 className="title-secondary mb-6">Liquidity</h2>
          <StyledTabs
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
          >
            <StyledTab label="Sided Liqudity" {...a11yProps(0)} />
            <StyledTab label="Liquidity Mining" {...a11yProps(1)} />
            <StyledTab label="GNT Lock" {...a11yProps(2)} />
            <StyledTab label="My LP tokens" {...a11yProps(3)} />
          </StyledTabs>
        </div>
      </div>

      <div className="dark:bg-dark-primary">
        <div className="main-container">
          <TabPanel value={value} index={0}>
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

            {advance ? (
              <AddLiquidityAdvance handleMode={handleMode} />
            ) : (
              <div className="max-w-2xl mx-auto py-8">
                <div className="flex justify-between mb-10">
                  <Tabs value={tab} onChange={handleTab}>
                    <Tab label="Add Lp" {...a11yProps(0)} />
                    <Tab label="remove lp" {...a11yProps(1)} />
                  </Tabs>
                  <button
                    onClick={handleMode}
                    className="text-light-primary gap-x-4 flex items-center dark:text-grey-dark"
                  >
                    <p className="capitalize"> advance mode</p>
                    <span className="text-2xl">
                      <ImLoop />
                    </span>
                  </button>
                </div>
                <TabPanel value={tab} index={0}>
                  <AddLiquiditySimple />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <RemoveLiquiditySimple />
                </TabPanel>
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1}>
            <LiquidityMining />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <GntLockTab />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <MyLpTokensTab />{" "}
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
