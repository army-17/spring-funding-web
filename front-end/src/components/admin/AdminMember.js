import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Header, Table, Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import Paging from "../Paging";

const AdminMember = () => {
  // 멤버 리스트
  const [memberItem, setMemberItem] = useState([]);

  // 멤버 페이징
  let mpNum = sessionStorage.getItem("mpNum");
  const [memberPage, setMemberPage] = useState({
    totalPage: 0,
    pageNum: 1,
  });

  useEffect(() => {
    mpNum !== null ? getMemberList(mpNum) : getMemberList(1);
  }, []);

  // 서버로부터 회원 목록 가져오기
  const getMemberList = (mpNum) => {
    axios
      .get("/member/page", { params: { pageNum: mpNum } })
      .then((res) => {
        const { totalPage, pageNum, mList } = res.data;
        setMemberPage({ totalPage: totalPage, pageNum: pageNum });
        setMemberItem(mList);
        sessionStorage.setItem("mpNum", pageNum);
      })
      .catch((err) => console.log(err));
  };

  //////////////////// Member /////////////////////
  // 출력할 회원 목록 작성
  let memberList = Object.values(memberItem).map((item) => (
    <Table.Row key={item.memberNum} textAlign="center">
      <Table.Cell>{item.memberNum}</Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.nickname}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.phone}</Table.Cell>
      <Table.Cell>
        <Button
          style={{
            border: "1px solid #ff6666",
            backgroundColor: "#ffffff",
            color: "#ff6666",
          }}
          size="small"
          onClick={() => delMember(item.memberNum)}
        >
          삭제
        </Button>
      </Table.Cell>
    </Table.Row>
  ));

  // 회원 삭제
  const delMember = (memberNum) => {
    axios
      .delete("/member/delete?MemberNum=" + memberNum)
      .then((res) => {
        const newMemberList = memberItem.filter(
          (mList) => mList.memberNum !== memberNum
        );
        setMemberItem(newMemberList);

        if (res.data === true) {
          Swal.fire({
            icon: "success",
            iconColor: "#00b2b2",
            title: "회원 삭제가 완료되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#00b2b2",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Container
        style={{
          display: "flex",
          verticalAlign: "middle",
          justifyContent: "space-between",
        }}
      >
        <Header style={{}}>회원 관리</Header>
      </Container>
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>이름</Table.HeaderCell>
            <Table.HeaderCell>닉네임</Table.HeaderCell>
            <Table.HeaderCell>이메일</Table.HeaderCell>
            <Table.HeaderCell>전화번호</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{memberList}</Table.Body>
      </Table>
      <Paging page={memberPage} getList={getMemberList} pageCntNum={5} />
    </Container>
  );
};

export default AdminMember;
