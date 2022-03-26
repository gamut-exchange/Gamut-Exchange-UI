import { useState } from "react";
import "./styles/global.css";
import Home from "./views/home/Index";
import Liquidity from "./views/liquidity/Index";
import Mine from "./views/mine/Index";
import { Routes, Route } from "react-router-dom";
import Swap from "./views/swap/Index";
import Lock from "./views/lock/Index";
import LpTokens from "./views/lpTokens/Index";

function App() {

  const [dark, setDark] = useState(false);
  const handleDark = () => {
    setDark(!dark);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home handleDark={handleDark} dark={dark} />} />
        <Route path="/swap" element={<Swap handleDark={handleDark} dark={dark} />} />
        <Route path="/liquidity" element={<Liquidity handleDark={handleDark} dark={dark} />} />
        <Route path="/mine" element={<Mine handleDark={handleDark} dark={dark} />} />
        <Route path="/lock" element={<Lock handleDark={handleDark} dark={dark} />} />
        <Route path="/lp_tokens" element={<LpTokens handleDark={handleDark} dark={dark} />} />
      </Routes>
    </>
  );
}

export default App;
