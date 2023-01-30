import React from "react";
import TokenOrderBookElement from "./TokenOrderBookElement";
import { Segment } from "semantic-ui-react";

const makeOrderBook = (orderList) => {
  let sellPriceList = [];
  let sellVolumeList = [];
  let buyPriceList = [];
  let buyVolumeList = [];

  if (orderList !== undefined) {
    const sellOrderList = orderList.filter((order) => order.type === 2);
    let sellOrderMap = sellOrderList.reduce((accu, order) => {
      accu.set(order.price, (accu.get(order.price) || 0) + order.remainAmount);
      return accu;
    }, new Map());
    sellOrderMap = new Map([...sellOrderMap].sort((a, b) => a[0] - b[0]));
    sellPriceList = Array.from(sellOrderMap.keys());
    sellVolumeList = Array.from(sellOrderMap.values());

    const buyOrderList = orderList.filter((order) => order.type === 1);
    let buyOrderMap = buyOrderList.reduce((accu, order) => {
      accu.set(order.price, (accu.get(order.price) || 0) + order.remainAmount);
      return accu;
    }, new Map());
    buyOrderMap = new Map([...buyOrderMap].sort((a, b) => b[0] - a[0]));
    buyPriceList = Array.from(buyOrderMap.keys());
    buyVolumeList = Array.from(buyOrderMap.values());
  }

  let id = 0;
  const result = [];
  // 매도 주문 출력
  let c = "#db2828";
  for (let i = 6; i >= 0; i--) {
    result.push(
      <TokenOrderBookElement
        key={id++}
        color={c}
        buyVolume={""}
        price={sellPriceList[i] === undefined ? "-" : sellPriceList[i]}
        sellVolume={sellVolumeList[i] === undefined ? "-" : sellVolumeList[i]}
      ></TokenOrderBookElement>
    );
  }
  // 매수 주문 출력
  c = "#00b2b2";
  for (let i = 0; i < 7; i++) {
    result.push(
      <TokenOrderBookElement
        key={id++}
        color={c}
        buyVolume={buyVolumeList[i] === undefined ? "-" : buyVolumeList[i]}
        price={buyPriceList[i] === undefined ? "-" : buyPriceList[i]}
        sellVolume={""}
      ></TokenOrderBookElement>
    );
  }
  // for (let i = 0; i < 13; i++) {
  //   let c = "black";
  //   if (i < 6) c = "red";
  //   else if (i > 6) c = "green";
  //   result.push(
  //     <TokenOrderBookElement
  //       key={i}
  //       color={c}
  //       // buyVolume={buyVolumeList[i] === undefined ? "0" : buyVolumeList[i]}
  //       // buyPrice={buyPriceList[i] === undefined ? "" : buyPriceList[i]}
  //       buyVolume={5}
  //       price={3000 - i * 100}
  //       sellVolume={5}
  //       // sellPrice={sellPriceList[i] === undefined ? "" : sellPriceList[i]}
  //       // sellVolume={sellVolumeList[i] === undefined ? "0" : sellVolumeList[i]}
  //     ></TokenOrderBookElement>
  //   );
  // }
  return <Segment basic={true}>{result}</Segment>;
};

const TokenOrderBook = (props) => {
  return makeOrderBook(props.orderList);
};

export default TokenOrderBook;
