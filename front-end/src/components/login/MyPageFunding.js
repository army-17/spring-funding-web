import axios from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container, Table } from "semantic-ui-react";

const MyPageFunding = () => {
  const nav = useNavigate();
  // 데이터
  const [myFundingItem, setMyFundingItem] = useState([]);

  const memberNum = sessionStorage.getItem("memberNum");

  // 날짜 형식
  const dateFormat = (date) => moment(date).format("YYYY.MM.DD");

  //금액 쉼표 표시
  const currentAmtFormat = (item) => {
    return item.currentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const targetAmtFormat = (item) => {
    return item.targetAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    // 내 펀딩 생성 내역 가져오기
    axios
      .get(`/funding/plist?MemberNum=${memberNum}`)
      .then((res) => {
        console.log(res.data);
        setMyFundingItem(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //타이틀 클릭 시 해당 펀딩 상세로 이동
  const getFunding = useCallback(
    (fundingNum) => {
      // 보여질 펀딩 글의 번호를 localStorage에 저장
      localStorage.setItem("memberNum", memberNum);
      localStorage.setItem("fundingNum", fundingNum);
      localStorage.setItem("fundingOwner", memberNum);
      // 해당 링크로 이동
      nav("funding/detail");
    },
    [nav]
  );

  // 내가 개설한 펀딩 내역
  const FundingTable = () => {
    return Object.values(myFundingItem).map((item) => {
      return (
        <Table.Row key={item.fundingNum} style={{ textAlign: "center", height: "49.42px" }}>
          <Table.Cell
            style={{ cursor: "pointer" }}
            onClick={() => getFunding(item.fundingNum)}
          >
            {item.title}
          </Table.Cell>
          {/* <Table.Cell>{item.title}</Table.Cell> */}
          <Table.Cell>{dateFormat(item.startDate)}</Table.Cell>
          <Table.Cell>{dateFormat(item.endDate)}</Table.Cell>
          <Table.Cell>{currentAmtFormat(item)}</Table.Cell>
          <Table.Cell>{targetAmtFormat(item)}</Table.Cell>
          <Table.Cell>{item.status}</Table.Cell>
        </Table.Row>
      );
    });
  };

  return (
    <Container>
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row style={{ textAlign: "center" }}>
            <Table.HeaderCell>펀딩명</Table.HeaderCell>
            <Table.HeaderCell>펀딩 시작일</Table.HeaderCell>
            <Table.HeaderCell>펀딩 종료일</Table.HeaderCell>
            <Table.HeaderCell>현재 금액</Table.HeaderCell>
            <Table.HeaderCell>목표 금액</Table.HeaderCell>
            <Table.HeaderCell>승인상태</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <FundingTable />
        </Table.Body>
      </Table>
    </Container>
  );
};

export default MyPageFunding;
