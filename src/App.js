import "./styles/global.css";
import Home from "./views/home/Index";
import Liquidity from "./views/liquidity/Index";
import Mine from "./views/mine/Index";
import { Routes, Route } from "react-router-dom";
import Swap from "./views/swap/Index";
import Lock from "./views/lock/Index";
import LpTokens from "./views/lpTokens/Index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/mine" element={<Mine />} />
        <Route path="/lock" element={<Lock />} />
        <Route path="/lp_tokens" element={<LpTokens />} />
      </Routes>
    </>
  );
}

export default App;
