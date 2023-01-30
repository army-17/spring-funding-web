import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container, Header, Table, Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import Paging from "../Paging";

const df = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");

const AdminBoard = () => {
  // 게시글 리스트
  const [boardItem, setBoardItem] = useState([]);

  // 게시글 페이징
  let bpNum = sessionStorage.getItem("bpNum");
  const [boardPage, setBoardPage] = useState({
    totalPage: 0,
    pageNum: 1,
  });

  useEffect(() => {
    bpNum !== null ? getBoardList(bpNum) : getBoardList(1);
  }, []);

  // 서버로부터 게시글 목록 가져오기
  const getBoardList = (bpNum) => {
    axios
      .get("/board/page", { params: { pageNum: bpNum, listCntNum: 5 } })
      .then((res) => {
        const { totalPage, pageNum, bList } = res.data;
        setBoardPage({ totalPage: totalPage, pageNum: pageNum });
        setBoardItem(bList);
        sessionStorage.setItem("bpNum", pageNum);
      })
      .catch((err) => console.log(err));
  };

  //////////////////// Board /////////////////////
  // 출력할 게시글 목록 작성
  let boardList = Object.values(boardItem).map((item) => (
    <Table.Row key={item.boardNum} textAlign="center">
      <Table.Cell>{item.boardNum}</Table.Cell>
      <Table.Cell>{item.memberNum.name}</Table.Cell>
      <Table.Cell>{item.title}</Table.Cell>
      <Table.Cell>{df(item.date)}</Table.Cell>
      <Table.Cell>
        <Button
          style={{
            border: "1px solid #ff6666",
            backgroundColor: "#ffffff",
            color: "#ff6666",
          }}
          size="small"
          onClick={() => delBoard(item.boardNum)}
        >
          삭제
        </Button>
      </Table.Cell>
    </Table.Row>
  ));

  // 게시글 삭제 처리
  const delBoard = (boardNum) => {
    axios
      .delete("/board?boardNum=" + boardNum)
      .then((res) => {
        const newBoardList = boardItem.filter(
          (bList) => bList.boardNum !== boardNum
        );
        setBoardItem(newBoardList);

        if (res.data === "삭제 성공") {
          Swal.fire({
            icon: "success",
            iconColor: "#00b2b2",
            title: "게시글 삭제가 완료되었습니다.",
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
        <Header style={{}}>게시글 관리</Header>
      </Container>
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>작성자</Table.HeaderCell>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>날짜</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{boardList}</Table.Body>
      </Table>
      <Paging page={boardPage} getList={getBoardList} pageCntNum={10} />
    </Container>
  );
};

export default AdminBoard;
