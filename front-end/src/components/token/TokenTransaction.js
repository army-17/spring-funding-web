import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, Header, Segment } from "semantic-ui-react";
import TokenOrderForm from "./TokenOrderForm";
import TokenOrderBook from "./TokenOrderBook";
import TokenOpenOrderList from "./TokenOpenOrderList";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";

const TokenTransaction = () => {
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

  const [msg, setMsg] = useState("...");
  const [initReadyFlag, setInitReadyFlag] = useState(false);
  const [tradeReadyFlag, setTradeReadyFlag] = useState(false);

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
    const initData = JSON.parse(body);
    if (initData.retCode !== 200) {
      return;
    }
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
    setInitReadyFlag(true);
    if (initData.fundingStatus === "종료") {
      setTradeReadyFlag(true);
    } else {
      setMsg("아직 개장 전입니다");
    }
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
  const btnBuyOrder = (price, amount) => {
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
  const btnSellOrder = (price, amount) => {
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
  const btnCancelOrder = (orderNum) => {
    const newOrder = {
      tokenOrderNum: orderNum,
      type: 3,
    };
    client.current.publish({
      destination: "/token/cancel/" + tokenNum,
      body: JSON.stringify(newOrder),
    });
  };

  return initReadyFlag && tradeReadyFlag ? (
    <Container textAlign="left">
      <Grid stackable centered style={{ margin: 0, padding: 0 }}>
        <Grid.Row style={{ margin: 0, padding: 0 }}>
          <Grid.Column
            textAlign="left"
            verticalAlign={"middle"}
            stretched
            style={{ margin: 0, padding: 0 }}
            width={16}
          >
            <Segment
              style={{ margin: 0, padding: 0, paddingBottom: 0 }}
              basic={true}
            >
              {/* <Header
                style={{ margin: 0, padding: 0, paddingLeft: 10 }}
                as={"h5"}
              >
                시작가:{data.listingPrice} 현재가:{data.currentPrice}원 최저가:
                {data.minPrice}원 최고가:{data.maxPrice}원
              </Header> */}
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row style={{ margin: 0, padding: 0, maxHeight: 440 }}>
          <Grid.Column
            verticalAlign={"middle"}
            stretched
            style={{
              margin: 0,
              padding: 0,
              maxHeight: 440,
            }}
            width={5}
          >
            <TokenOrderBook orderList={data.orderList}></TokenOrderBook>
          </Grid.Column>
          <Grid.Column
            textAlign="left"
            verticalAlign={"middle"}
            stretched
            style={{
              margin: 0,
              padding: 0,
              maxHeight: 440,
            }}
            width={6}
          >
            <Container>
              <TokenOrderForm
                availablePoint={data.availablePoint}
                availableToken={data.availableToken}
                sendBuyOrder={btnBuyOrder}
                sendSellOrder={btnSellOrder}
              ></TokenOrderForm>
            </Container>
          </Grid.Column>
          <Grid.Column
            verticalAlign={"top"}
            stretched
            style={{
              margin: 0,
              padding: 0,
              paddingLeft: 10,
              maxHeight: 440,
              overflow: "auto",
            }}
            width={5}
          >
            <TokenOpenOrderList
              myOrderList={data.myOrderList}
              cancel={btnCancelOrder}
            ></TokenOpenOrderList>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Container>
    </Container>
  ) : (
    <Container textAlign="center" style={{ marginTop: 30, marginBottom: 30 }}>
      <Header>{msg}</Header>
    </Container>
  );
};

export default TokenTransaction;
