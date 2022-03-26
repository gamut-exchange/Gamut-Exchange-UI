import React from "react";
import Layout from "../../components/Layout";
import Efficient from "../../components/Efficient";
import Header from "./Header";
import TryItOut from "./TryItOut";
const Index = ({handleDark, dark}) => {
  return (
    <>
      <Layout handleDark={handleDark} dark={dark}>
        <Header />
        <TryItOut />
        <Efficient />
      </Layout>
    </>
    //
  );
};

export default Index;
