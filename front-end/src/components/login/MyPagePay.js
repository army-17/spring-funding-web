import axios from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Container, Table } from "semantic-ui-react";

const MyPagePay = () => {
  // 데이터
  const [myPayItem, setMyPayItem] = useState([]);

  const memberNum = sessionStorage.getItem("memberNum");

  const dateFormat = (date) => moment(date).format("YYYY.MM.DD");

  useEffect(() => {
    // 내 결제 내역 가져오기
    axios
      .get(`/payment/list?MemberNum=${memberNum}`)
      .then((res) => {
        console.log(res.data);
        setMyPayItem(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // 타이틀 클릭 시 해당 펀딩 상세로 이동
  const getPay = useCallback((payNum) => {
    // 보여질 펀딩 글의 번호를 localStorage에 저장
    localStorage.setItem("payNum", payNum);
  });

  // 내가 개설한 펀딩 내역
  const FundingTable = () => {
    return Object.values(myPayItem).map((item) => {
      return (
        <Table.Row key={item.payNum} style={{ textAlign: "center", height: "49.42px" }}>
          <Table.Cell onClick={() => getPay(item.payNum)}>
            {item.orderNum}
          </Table.Cell>
          <Table.Cell>{item.orderName}</Table.Cell>
          <Table.Cell>{dateFormat(item.date)}</Table.Cell>
        </Table.Row>
      );
    });
  };

  return (
    <Container>
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row style={{ textAlign: "center" }}>
            <Table.HeaderCell>주문 번호</Table.HeaderCell>
            <Table.HeaderCell>상품명</Table.HeaderCell>
            <Table.HeaderCell>결제 일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <FundingTable />
        </Table.Body>
      </Table>
    </Container>
  );
};

export default MyPagePay;
