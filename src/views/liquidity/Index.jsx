import React from "react";
import Layout from "../../components/Layout";
import Liquidity from "./Liquidity";

const Index = ({handleDark, dark}) => {
  return (
    <Layout handleDark={handleDark} dark={dark}>
      <Liquidity />
    </Layout>
  );
};

export default Index;
