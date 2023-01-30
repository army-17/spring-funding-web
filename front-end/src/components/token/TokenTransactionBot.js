import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "semantic-ui-react";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";

const TokenTransactionBot = () => {
  const memberNum = Number(sessionStorage.getItem("memberNum"));
  const tokenNum = localStorage.getItem("fundingNum");
  const [data, setData] = useState({
    currentPrice: 0,
    listingPrice: 0,
    maxPrice: 1,
    minPrice: 0,
    availablePoint: 0,
    availableToken: 0,
    orderList: [],
    myOrderList: [],
    endDate: "",
  });

  const client = useRef({});
  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () => new SockJS("http://localhost:9999/webSocket"),
      debug: function (str) {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
        initReq();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const initReq = () => {
    if (memberNum === null) {
      return;
    }
    // 데이터 초기화 요청
    const newMessage = { memberNum: memberNum, tokenNum: tokenNum };
    client.current.publish({
      destination: "/token/init/" + memberNum,
      body: JSON.stringify(newMessage),
    });
  };

  function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : "0" + month;
    day = day >= 10 ? day : "0" + day;
    hour = hour >= 10 ? hour : "0" + hour;
    minute = minute >= 10 ? minute : "0" + minute;
    second = second >= 10 ? second : "0" + second;

    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      "T" +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  }

  const initCallback = (body) => {
    console.log(body);
    console.log(memberNum);
    const initData = JSON.parse(body);
    if (initData.retCode !== 200) {
      console.log(initData.retCode);
      return;
    }

    console.log("init", initData.availableToken);

    const dataObj = {
      ...data,
      tokenNum: initData.token.tokenNum,
      currentPrice: initData.token.currentPrice,
      listingPrice: initData.token.listingPrice,
      availablePoint: initData.member.point,
      availableToken: initData.availableToken,
      orderList: initData.tokenOrderList,
      myOrderList: initData.myOrderList,
      endDate: initData.endDate,
    };
    console.log(dataObj);
    setData(dataObj);
  };

  const orderCallBack = (body) => {
    const res = JSON.parse(body);
    if (res.retCode !== 200) {
      return;
    }
    for (let i = 0; i < res.txList.length; i++) {
      const tx = res.txList[i];
      // 저장할 데이터 처리
      setData((prev) => {
        let newData = { ...prev };
        let newOrderList = [];
        // 주문 타입에 따른 주문 얻기
        const newOrder = tx.sellOrder === null ? tx.buyOrder : tx.sellOrder;

        // 체결된 경우
        if (tx.buyOrder !== null && tx.sellOrder !== null) {
          // 주문 리스트 갱신
          prev.orderList.forEach((order) => {
            if (order.orderNum === tx.buyOrder.orderNum) {
              order.remainAmount = tx.buyOrder.remainAmount;
            } else if (order.orderNum === tx.sellOrder.orderNum) {
              order.remainAmount = tx.sellOrder.remainAmount;
            }
            newOrderList.push(order);
          });
          // 주문 리스트에서 잔여 수량이 없는 주문 제거
          newOrderList = newOrderList.filter(
            (order) => order.remainAmount !== 0
          );
          newData = {
            ...newData,
            orderList: newOrderList,
          };
        }
        // 체결되지 않은 경우
        else {
          // 주문 리스트에 주문 추가
          newData = {
            ...newData,
            orderList: [...prev.orderList, newOrder],
          };
        }

        // 내 주문 리스트 업데이트
        if (
          memberNum === tx.buyerMemberNum ||
          memberNum === tx.sellerMemberNum
        ) {
          // 체결되지 않은 경우: 내 주문 리스트에 주문 추가
          if (tx.buyOrder === null || tx.sellOrder === null) {
            newData = {
              ...newData,
              myOrderList: [...prev.myOrderList, newOrder],
            };
          }
          // 체결된 경우: 내 주문 리스트에 존재하는 내 주문 찾기
          else {
            const newMyOrderList = newOrderList.filter(
              (order) => memberNum === order.memberNum
            );
            newData = {
              ...newData,
              myOrderList: [...newMyOrderList],
            };
          }
        }
        // 내 주문이 처리된 경우의 보유 포인트 및 토큰 업데이트
        if (memberNum === tx.buyerMemberNum) {
          newData = {
            ...newData,
            availableToken: tx.buyerTokenAmount,
            availablePoint: tx.buyerPoint,
          };
        } else if (memberNum === tx.sellerMemberNum) {
          newData = {
            ...newData,
            availableToken: tx.sellerTokenAmount,
            availablePoint: tx.sellerPoint,
          };
        }
        return { ...prev, ...newData };
      });
    }
  };

  const cancelCallBack = (body) => {
    const res = JSON.parse(body);
    if (res.retCode !== 200) {
      console.log(res.errorMsg);
      return;
    }
    const tx = res.txList[0];

    // 저장할 데이터 처리
    setData((prev) => {
      let newData = { ...prev };

      // 내가 주문한 경우의 보유 포인트 및 토큰 업데이트
      if (memberNum === tx.buyerMemberNum) {
        // 포인트 및 보유 토큰 업데이트
        newData = {
          ...newData,
          availableToken: tx.buyerTokenAmount,
          availablePoint: tx.buyerPoint,
        };
        //내 주문 리스트에 주문에서 해당하는 주문 삭제
        const newOrderList = prev.myOrderList.filter(
          (order) => order.orderNum !== tx.cancelOrder.orderNum
        );
        newData = {
          ...newData,
          myOrderList: [...newOrderList],
        };
      }

      // 주문 리스트에서 삭제
      const newOrderList = prev.orderList.filter(
        (order) => order.orderNum !== tx.cancelOrder.orderNum
      );
      newData = {
        ...newData,
        orderList: [...newOrderList],
      };

      return { ...prev, ...newData };
    });
  };

  const subscribe = () => {
    // 초기화 요청에 대한 응답 구독
    client.current.subscribe("/queue/init-" + memberNum, ({ body }) =>
      initCallback(body)
    );

    // 주문 요청에 대한 응답 구독
    client.current.subscribe("/topic/order/" + tokenNum, ({ body }) => {
      orderCallBack(body);
    });

    // 주문 취소 요청에 대한 응답 구독
    client.current.subscribe("/topic/cancel/" + tokenNum, ({ body }) => {
      cancelCallBack(body);
    });
  };

  // 매수 주문 버튼 클릭
  const buyOrder = (price, amount) => {
    const newOrder = {
      type: 1,
      price: price,
      amount: amount,
    };
    client.current.publish({
      destination: "/token/order/" + tokenNum,
      body: JSON.stringify(newOrder),
    });
  };

  // 매도 주문 버튼 클릭
  const sellOrder = (price, amount) => {
    const newOrder = {
      type: 2,
      price: price,
      amount: amount,
    };
    client.current.publish({
      destination: "/token/order/" + tokenNum,
      body: JSON.stringify(newOrder),
    });
  };

  // 주문 취소 버튼 클릭
  const cancelOrder = (orderNum) => {
    const newOrder = {
      tokenOrderNum: orderNum,
      type: 3,
    };
    client.current.publish({
      destination: "/token/cancel/" + tokenNum,
      body: JSON.stringify(newOrder),
    });
  };

  const [btnVal, setBtnVal] = useState("시작");
  const [btnToggle, setBtnToggle] = useState(true);
  const onClick = useCallback(
    (e) => {
      if (btnToggle === false) return;
      startBot();
      setBtnToggle(false);
    },
    [btnToggle, data]
  );

  const startBot = () => {
    const orderBot = () => {
      let randAct = Math.floor(Math.random() * 3) + 1; // 1~3
      let randAmount = Math.floor(Math.random() * 3) + 1; // 1~3
      let randRange = Math.floor(Math.random() * 8) + 2; // 2~9

      console.log("보유 토큰: " + data.availableToken);
      console.log("보유 포인트: " + data.availablePoint);
      switch (randAct) {
        case 1:
          // 매수 시도
          let bOrder = null;
          for (let i = 0; i < data.orderList.length; i++) {
            if (data.orderList[i].type === 1) {
              bOrder = data.orderList[i];
              break;
            }
          }
          if (bOrder !== null) {
            const price = bOrder.price - (randRange - 4) * 100;
            console.log("매수 주문: " + price + ", " + randAmount);
            buyOrder(price, randAmount);
          }
          break;
        case 2:
          // 매도 시도
          let sOrder = null;
          for (let i = 0; i < data.orderList.length; i++) {
            if (data.orderList[i].type === 2) {
              sOrder = data.orderList[i];
              break;
            }
          }
          if (sOrder !== null) {
            const price = sOrder.price - (randRange - 4) * 100;
            console.log("매도 주문: " + price + ", " + randAmount);
            sellOrder(price, randAmount);
          }
          break;
        case 3:
          // 주문 취소 시도
          break;
        default:
          break;
      }

      console.log(btnToggle);

      if (btnToggle === true) {
        setTimeout(orderBot, 1000);
      }
    };

    setTimeout(orderBot, 1000);
  };

  const cancelBot = () => {};

  return (
    <div>
      <Button onClick={onClick}>{btnVal}</Button>
    </div>
  );
};

export default TokenTransactionBot;
