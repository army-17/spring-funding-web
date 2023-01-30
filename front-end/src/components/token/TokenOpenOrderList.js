import React from "react";
import { Segment } from "semantic-ui-react";
import TokenOpenOrderElement from "./TokenOpenOrderElement";

const makeTokenOpenOrderList = (orderList, cancel) => {
  if (orderList === undefined) return;
  const result = [];
  // result.push(<Header style={{ margin: 0, padding: 0 }}>주문 내역</Header>);
  for (let i = 0; i < orderList.length; i++) {
    const order = orderList[i];
    let color = "#db2828";
    if (order.type === 1) {
      color = "#00b2b2";
    }
    result.push(
      <TokenOpenOrderElement
        key={i}
        color={color}
        orderNum={order.orderNum}
        orderRemainAmount={order.remainAmount}
        orderType={order.type === 1 ? "BUY" : "SELL"}
        orderPrice={order.price}
        cancelOrder={cancel}
      ></TokenOpenOrderElement>
    );
  }
  return <Segment basic={true}>{result}</Segment>;
};

const TokenOpenOrderList = (props) => {
  return makeTokenOpenOrderList(props.myOrderList, props.cancel);
};

export default TokenOpenOrderList;
