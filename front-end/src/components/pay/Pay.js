import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Container, Header, Table } from "semantic-ui-react";
import KakaoPayReady from "./KakaoPayReady";
import "./Pay.scss";

const Pay = () => {
  // 현재 로그인한 사용자 정보 담는 변수
  const [logMem, setLogMem] = useState({
    point: 0,
  });

  const memberNum = sessionStorage.getItem("memberNum");
  console.log("memberNum : " + memberNum);

  useEffect(() => {
    // 서버로부터 해당 펀딩 내용 가져오기
    axios
      .get("/member/get", { params: { MemberNum: memberNum } })
      .then((res) => {
        console.log(res.data);
        setLogMem(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // pay 정보
  const pay1 = {
    next_redirect_pc_url: "",
    tid: "",
    created_at: "",
    params: {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      item_name: "10,000 포인트",
      quantity: 1,
      total_amount: 10000,
      vat_amount: 0,
      tax_free_amount: 0,
      approval_url: "http://localhost:3000/pay/kakaoPayApprove",
      fail_url: "http://localhost:3000/pay",

      cancel_url: "http://localhost:3000/pay",
    },
  };

  const pay2 = {
    next_redirect_pc_url: "",
    tid: "",
    created_at: "",
    params: {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      item_name: "50,000 포인트",
      quantity: 1,
      total_amount: 50000,
      vat_amount: 0,
      tax_free_amount: 0,
      approval_url: "http://localhost:3000/pay/kakaoPayApprove",
      fail_url: "http://localhost:3000/pay",
      cancel_url: "http://localhost:3000/pay",
    },
  };

  const pay3 = {
    next_redirect_pc_url: "",
    tid: "",
    created_at: "",
    params: {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      item_name: "100,000 포인트",
      quantity: 1,
      total_amount: 100000,
      vat_amount: 0,
      tax_free_amount: 0,
      approval_url: "http://localhost:3000/pay/kakaoPayApprove",
      fail_url: "http://localhost:3000/pay",
      cancel_url: "http://localhost:3000/pay",
    },
  };

  // 선택된 결제 금액에 따라 pay값 저장
  const [readyPay, setReadyPay] = useState(pay1);

  // 선택한 결제 금액의 추가 포인트 값
  const [plusPoint, setPlusPoint] = useState(500);

  const handleChange = useCallback((e) => {
    if (e.target.value === "10000원") {
      setReadyPay(pay1);
      setPlusPoint(500);
    } else if (e.target.value === "50000원") {
      setReadyPay(pay2);
      setPlusPoint(3000);
    } else if (e.target.value === "100000원") {
      setReadyPay(pay3);
      setPlusPoint(7000);
    }
  }, []);

  return (
    <Container>
      <Header style={{}}>
        <div
          style={{
            backgroundColor: "#00b2b2",
            color: "#fff",
            marginTop: "7.5px",
            paddingLeft: "20px",
            height: "40px",
            lineHeight: "40px",
            textAlign: "left",
          }}
        >
          충전 금액 선택
        </div>
      </Header>

      <Table
        style={{ marginTop: "10%" }}
        celled
        compact
        definition
        collapsing={false}
      >
        <Table.Header style={{ height: "60px" }} fullWidth>
          <Table.Row textAlign="center">
            <Table.HeaderCell>충전 금액</Table.HeaderCell>
            <Table.HeaderCell>추가 지급</Table.HeaderCell>
            <Table.HeaderCell>총 결제 금액</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row style={{ height: "60px" }}>
            <Table.Cell>
              <div
                style={{
                  paddingLeft: "36%",
                }}
              >
                <input
                  type="radio"
                  name="price"
                  defaultChecked
                  value="10000원"
                  onChange={handleChange}
                />
                10,000 포인트
              </div>
            </Table.Cell>
            <Table.Cell textAlign="center">+ 500</Table.Cell>
            <Table.Cell textAlign="center">10,000원</Table.Cell>
          </Table.Row>
          <Table.Row style={{ height: "60px" }}>
            <Table.Cell>
              <div
                style={{
                  paddingLeft: "36%",
                }}
              >
                <input
                  type="radio"
                  name="price"
                  value="50000원"
                  onChange={handleChange}
                />
                50,000 포인트
              </div>
            </Table.Cell>
            <Table.Cell textAlign="center">+ 3,000</Table.Cell>
            <Table.Cell textAlign="center">50,000원</Table.Cell>
          </Table.Row>
          <Table.Row style={{ height: "60px" }}>
            <Table.Cell>
              <div
                style={{
                  paddingLeft: "36%",
                }}
              >
                <input
                  type="radio"
                  name="price"
                  value="100000원"
                  onChange={handleChange}
                />
                100,000 포인트
              </div>
            </Table.Cell>
            <Table.Cell textAlign="center">+ 7,000</Table.Cell>
            <Table.Cell textAlign="center">100,000원</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Table style={{ marginTop: "25px", marginBottom: "5px" }}>
        <Table.Header style={{ height: "60px" }} fullWidth>
          <Table.Row textAlign="center">
            <Table.HeaderCell>현재 보유 포인트</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>충전할 포인트 금액</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>추가 지급</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>최종 포인트</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row style={{ height: "60px" }} textAlign="center">
            <Table.Cell>{logMem.point.toLocaleString("ko-KR")}</Table.Cell>
            <Table.Cell>+</Table.Cell>
            <Table.Cell>
              {readyPay.params.total_amount.toLocaleString("ko-KR")}
            </Table.Cell>
            <Table.Cell>+</Table.Cell>
            <Table.Cell>{plusPoint.toLocaleString("ko-KR")}</Table.Cell>
            <Table.Cell>=</Table.Cell>
            <Table.Cell>
              {(
                logMem.point +
                readyPay.params.total_amount +
                plusPoint
              ).toLocaleString("ko-KR")}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Container style={{ height: "40px" }}>
        <KakaoPayReady price={readyPay} />
      </Container>
    </Container>
  );
};

export default Pay;
