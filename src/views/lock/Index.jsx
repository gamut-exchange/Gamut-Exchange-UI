import React from "react";
import Layout from "../../components/Layout";
import Lock from "./Lock";

const Index = ({ handleDark, dark }) => {
  return (
    <Layout handleDark={handleDark} dark={dark}>
      <Lock />
    </Layout>
  );
};

export default Index;
