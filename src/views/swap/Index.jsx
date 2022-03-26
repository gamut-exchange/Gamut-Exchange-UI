import React from "react";
import Layout from "../../components/Layout";
import Swap from "./Swap";

const Index = ({ handleDark, dark }) => {
  return (
    <Layout handleDark={handleDark} dark={dark}>
      <Swap />
    </Layout>
  );
};

export default Index;
