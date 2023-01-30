import axios from "axios";
import moment from "moment/moment";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table } from "semantic-ui-react";
import Loading from "../common/Loading";
import Paging from "../Paging";

const dateFormat = (date) => moment(date).format("YYYY.MM.DD");

const BoardListTable = () => {

  //자유게시판 게시물 총 갯수
  let boardListNum = sessionStorage.getItem("boardListNum");
  
  const nav = useNavigate();

  const [boardItem, setBoardItem] = useState([]);
  const [loading, setLoading] = useState(null);


  //자유게시판 페이징 처리
  let bpNum = sessionStorage.getItem("bpNum");
  const [boardPage, setBoardPage] = useState({
    totalPage: 0,
    pageNum: 1,
  });
  const [boardListCount, setBoardListCount] = useState(0);


  //자유게시판 페이징 처리
  useEffect(() => {
    setLoading(true);

    bpNum !== null ? getBoardList(bpNum) : getBoardList(1);

    axios
    .get("/board/list")
    .then((res) => {
      // console.log("게시글 갯수" + res.data.length);
      sessionStorage.setItem("boardListNum", res.data.length);
      setBoardListCount(res.data.length);
      setLoading(false);
    })
    .catch((err) => console.log(err));
  }, [boardListCount]);
  

  //자유게시판 리스트 출력 함수
  const getBoardList = (bpNum) => {
    axios
      .get("/board/page", { params: { pageNum: bpNum, listCntNum: 15 } })
      .then((res) => {
        const { totalPage, pageNum, bList } = res.data;
        setBoardPage({ totalPage: totalPage, pageNum: pageNum });
        setBoardItem(bList);
        sessionStorage.setItem("bpNum", pageNum);
      })
      .catch((err) => console.log(err));
  }


  const getBoardDetail = useCallback((boardNum) => {
    localStorage.setItem("boardNum", boardNum);
    nav("/board/detail");
  });

  //출력할 게시글 목록 작성
  let boardList = null;
  if (boardItem.length === 0) {
    boardList = (
      <Table.Row key={0}>
        <Table.Cell
          colspan="5"
          style={{
            height: "200px",
            lineHeight:"200px",
            fontSize: "17px",
            color: "#90949c",
            fontWeight:400
          }}
        >
          게시글이 아직 존재하지 않습니다.
        </Table.Cell>
      </Table.Row>
    );
  } else {
    boardList = Object.values(boardItem).map((bItem) => (
      <Table.Row key={bItem.boardNum} className="tableCell" style={{height:"40px"}}>
        <Table.Cell>
          <div onClick={() => getBoardDetail(bItem.boardNum)} style={{cursor:"pointer"}}>
            {bItem.boardNum}
          </div>
        </Table.Cell>
        <Table.Cell>
          <div
            onClick={() => getBoardDetail(bItem.boardNum)}
            style={{
              cursor: "pointer",
            }}
          >
            {bItem.title}
          </div>
        </Table.Cell>
        <Table.Cell>{bItem.memberNum.nickname}</Table.Cell>
        <Table.Cell>{dateFormat(bItem.date)}</Table.Cell>
        <Table.Cell>{bItem.view}</Table.Cell>
      </Table.Row>
    ));
  }

  return (
    <Container>
      <div style={{display:"inline", fontSize:"16px", float:"left"}}>
        <div style={{ display:"inline", textAlign:"left"}}>총&nbsp;&nbsp;</div>
        <div style={{display:"inline", color:"#00b2b2", fontWeight:"bold"}}>{boardListNum}개</div>
        <div style={{display:"inline"}}>의 게시물이 있습니다.</div>
      </div>
      
      <Table celled compact definition collapsing={false}>
        <Table.Header fullWidth>
          <Table.Row style={{ textAlign: "center" }}>
            <Table.HeaderCell style={{ width: "10%" }}>번호</Table.HeaderCell>
            <Table.HeaderCell style={{ width: "35%" }}>제목</Table.HeaderCell>
            <Table.HeaderCell style={{ width: "20%" }}>작성자</Table.HeaderCell>
            <Table.HeaderCell style={{ width: "25%" }}>
              작성날짜
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: "10%" }}>조회수</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body style={{ textAlign: "center" }}>{boardList}</Table.Body>
      </Table>
      <Paging page={boardPage} getList={getBoardList} pageCntNum={15} />
      {loading && <Loading/>}
    </Container>
  );
};

export default BoardListTable;
