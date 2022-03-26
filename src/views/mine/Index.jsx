import React from "react";
import Layout from "../../components/Layout";
import Mine from "./Mine";

const Index = ({ handleDark, dark }) => {
  return (
    <Layout handleDark={handleDark} dark={dark}>
      <Mine />
    </Layout>
  );
};

export default Index;
