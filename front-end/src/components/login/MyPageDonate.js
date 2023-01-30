import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table } from "semantic-ui-react";

const MyPageDonate = () => {
  const nav = useNavigate();
  // 데이터
  const [myDonateItem, setMyDonateItem] = useState([]);

  const memberNum = sessionStorage.getItem("memberNum");

  useEffect(() => {
    // 내 결제 내역 가져오기
    axios
      .get(`/donate/dlist?MemberNum=${memberNum}`)
      .then((res) => {
        console.log(res.data);
        setMyDonateItem(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // 타이틀 클릭 시 해당 펀딩 상세로 이동
  const getFunding = useCallback(
    (fundingNum) => {
      // 보여질 펀딩 글의 번호를 localStorage에 저장
      localStorage.setItem("fundingNum", fundingNum);
      console.log("dona" + fundingNum);
      // 해당 링크로 이동
      nav("/funding/detail");
    },
    [nav]
  );

  // 내가 후원한 후원 내역
  const DonateTable = () => {
    return Object.values(myDonateItem).map((item) => {
      return (
        <Table.Row key={item.donateNum} style={{ textAlign: "center", height: "49.42px" }}>
          <Table.Cell
            style={{ cursor: "pointer" }}
            onClick={() => getFunding(item.fundingNum)}
          >
            {item.fundingTitle}
          </Table.Cell>
          <Table.Cell>{item.donateAmount} 포인트</Table.Cell>
        </Table.Row>
      );
    });
  };
  return (
    <Container>
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row style={{ textAlign: "center" }}>
            <Table.HeaderCell>펀딩 제목</Table.HeaderCell>
            <Table.HeaderCell>후원 금액</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <DonateTable />
        </Table.Body>
      </Table>
    </Container>
  );
};

export default MyPageDonate;
