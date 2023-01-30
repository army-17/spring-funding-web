import React, { useCallback, useState } from "react";
import GoodsList from "./GoodsList";
import { Container, Header } from "semantic-ui-react";

const Goods = () => {
  const [myTokenAmount, setMyTokenAmount] = useState(
    sessionStorage.getItem("currentTokenAmount")
  );

  const onChange = useCallback((amount) => {
    setMyTokenAmount(amount);
  }, []);

  return (
    <Container textAlign="left">
      <Container textAlign="center">
        <Header as={"h2"} textAlign="right" style={{ color: "#00b2b2" }}>
          {myTokenAmount}{" "}
          <span style={{ fontSize: "15px", color: "#000000" }}>
            {sessionStorage.getItem("tokenName")}
          </span>{" "}
          <span style={{ color: "#000000" }}>보유</span>
        </Header>
        <GoodsList onChange={onChange}></GoodsList>
      </Container>
    </Container>
  );
};

export default Goods;
