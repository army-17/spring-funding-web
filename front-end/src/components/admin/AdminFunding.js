import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Header, Table } from "semantic-ui-react";
import Paging from "../Paging";

const AdminFunding = () => {
  const nav = useNavigate();

  // 펀딩 리스트
  const [fundingItem, setFundingItem] = useState([]);

  // 펀딩 페이징
  let fpNum = sessionStorage.getItem("fpNum");
  const [fundingPage, setFundingPage] = useState({
    totalPage: 0,
    pageNum: 1,
  });

  useEffect(() => {
    fpNum !== null ? getFundingList(fpNum) : getFundingList(1);
  }, []);

  // 서버로부터 펀딩 목록 가져오기
  const getFundingList = (fpNum) => {
    axios
      .get("/funding/admin/page", { params: { pageNum: fpNum } })
      .then((res) => {
        const { totalPage, pageNum, fList } = res.data;

        // 펀딩 상태 0 => '대기' 처리
        for (let i = 0; i < fList.length; i++) {
          if (fList[i].status === "0") {
            fList[i].status = "대기";
          }
        }

        setFundingPage({ totalPage: totalPage, pageNum: pageNum });
        setFundingItem(fList);
        sessionStorage.setItem("fpNum", pageNum);
      })
      .catch((err) => console.log(err));
  };

  //////////////////// Funding /////////////////////
  // 출력할 펀딩 목록 작성
  let fundingList = Object.values(fundingItem).map((item) => (
    <Table.Row
      style={{ height: "49.42px" }}
      key={item.fundingNum}
      textAlign="center"
    >
      <Table.Cell>{item.fundingNum}</Table.Cell>
      <Table.Cell>{item.memberNum.name}</Table.Cell>
      <Table.Cell>
        <div onClick={() => getFunding(item.fundingNum)}>{item.title}</div>
      </Table.Cell>
      <Table.Cell>{item.targetAmount}</Table.Cell>
      <Table.Cell>{item.status}</Table.Cell>
    </Table.Row>
  ));

  // 해당 펀딩 상세로 이동
  const getFunding = useCallback(
    (fundingNum) => {
      // 보여질 펀딩 글의 번호를 localStorage에 저장
      localStorage.setItem("fundingNum", fundingNum);
      // 해당 링크로 이동
      nav("/adminPage/fundingDetail");
    },
    [nav]
  );

  return (
    <Container>
      <Container
        style={{
          display: "flex",
          verticalAlign: "middle",
          justifyContent: "space-between",
        }}
      >
        <Header style={{}}>펀딩 관리</Header>
      </Container>
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>작성자</Table.HeaderCell>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>목표 금액</Table.HeaderCell>
            <Table.HeaderCell>상태</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{fundingList}</Table.Body>
      </Table>
      <Paging page={fundingPage} getList={getFundingList} pageCntNum={5}/>
    </Container>
  );
};

export default AdminFunding;
