import React from "react";
import Layout from "../../components/Layout";
import Faucet from "./Faucet";

const Index = ({ handleDark, dark }) => {
  return (
    <Layout handleDark={handleDark} dark={dark}>
      <Faucet />
    </Layout>
  );
};

export default Index;
