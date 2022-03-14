import "./styles/global.css";
import Home from "./views/home/Index";
import Liquidity from "./views/liquidity/Index";
import { Routes, Route } from "react-router-dom";
import Swap from "./views/swap/Index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/swap" element={<Swap />} />
      </Routes>
    </>
  );
}

export default App;
