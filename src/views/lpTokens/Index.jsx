import React from "react";
import Layout from "../../components/Layout";
import LpTokens from "./LpTokens";

const Index = ({ handleDark, dark }) => {
  return (
    <Layout handleDark={handleDark} dark={dark}>
      <LpTokens />
    </Layout>
  );
};

export default Index;
