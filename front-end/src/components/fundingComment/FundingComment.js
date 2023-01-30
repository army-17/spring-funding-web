import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Comment, Form } from "semantic-ui-react";
import Swal from "sweetalert2";
import Button from "../common/Button";
import FundingCommentList from "./FundingCommentList";

const FundingComment = () => {
  const memberNum = sessionStorage.getItem("memberNum");
  const fundingNum = localStorage.getItem("fundingNum");
  const nav = useNavigate();
  const [fundCom, setFundCom] = useState({
    content: "",
    fundingNum: fundingNum,
  });
  const [fundComData, setFundComData] = useState([]);

  //해당 펀딩에 대한 후원자 판단 여부
  let isDonator = sessionStorage.getItem("isDonator");

  // 펀딩 댓글 리스트 출력
  useEffect(() => {
    axios
      .get("/funding/comment/list", { params: { fundingNum: fundingNum } })
      .then((res) => {
        setFundComData(res.data);
        localStorage.setItem("fundAmount", res.data.length);
      })
      .catch((error) => console.log(error));
  }, [fundComData]);

  //펀딩 댓글 입력 기능
  const fundComWrite = useCallback(() => {
    axios
      .post(
        "/funding/comment",
        { memberNum: { memberNum: memberNum }, content: fundCom.content },
        { params: { fundingNum: fundingNum } }
      )
      .then((res) => {
        if (res.data !== null) {
          // alert("댓글 작성에 성공하셨습니다.");
          setFundComData([...fundComData, res.data]);
        } else {
          // alert("댓글 작성에 실패하셨습니다.");
        }
      })
      .catch((error) => console.log(error));
    setFundCom({ ...fundCom, content: "" });
  }, [fundCom, fundComData]);

  // 댓글 삭제 함수
  const deleteComment = useCallback(
    (comNum) => {
      // console.log("deleteComment");
      // console.log(fundComData);

      axios
        .delete("/funding/comment", { params: { fundingComNum: comNum } })
        .then((res) => {
          if (res.data === "댓글 삭제 성공") {
            Swal.fire({
              icon: "success",
              iconColor: "#00b2b2",
              title: "댓글 삭제가 완료되었습니다.",
              showConfirmButton: true,
              confirmButtonColor: "#00b2b2",
            });
            const newCommentList = fundComData.filter(
              (comment) => comment.fundingComNum !== comNum
            );
            setFundComData(newCommentList);
          }
        })
        .catch((err) =>
          Swal.fire({
            icon: "error",
            iconColor: "#ff6666",
            title: "댓글 삭제가 실패되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#ff6666",
          })
        );
    },
    [fundComData]
  );

  // 댓글 수정 함수
  const modifyComment = useCallback(
    (comNum, content) => {
      console.log(comNum);
      axios
        .put(
          "/funding/comment",
          { content: content },
          {
            params: { fundingComNum: comNum },
          }
        )
        .then((res) => {
          if (res.data !== null) {
            console.log("update res", res.data);
            const updatedComment = res.data;
            let newCommentList = [];
            for (let comment of fundComData) {
              if (updatedComment.fundingComNum === comment.fundingComNum) {
                comment.content = updatedComment.content;
                comment.date = updatedComment.date;
                newCommentList.push(comment);
              } else {
                newCommentList.push(comment);
              }
            }
            setFundComData(newCommentList);
            Swal.fire({
              icon: "success",
              iconColor: "#00b2b2",
              title: "댓글 수정이 완료되었습니다.",
              showConfirmButton: true,
              confirmButtonColor: "#00b2b2",
            });
          }
        })
        .catch((err) =>
          Swal.fire({
            icon: "error",
            iconColor: "#ff6666",
            title: "댓글 수정이 실패되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#ff6666",
          })
        );
    },
    [fundComData]
  );

  const onChange = useCallback(
    (e) => {
      const dataObj = {
        ...fundCom,
        [e.target.name]: e.target.value,
      };
      setFundCom(dataObj);
    },
    [fundCom]
  );

  return (
    <Container textAlign="left">
      <Comment.Group style={{ maxWidth: "100%" }}>
        <Form
          reply
          onSubmit={fundComWrite}
          style={{
            height: "200px",
            padding: "30px 30px 30px 30px",
            backgroundColor: "rgb(245, 245, 245)",
          }}
        >
          <h3>창작자에게 응원의 한마디</h3>
          <h7>응원글은 펀딩 종료 전까지 작성 가능합니다.</h7>
          {isDonator == "true" ? (
            <Form.Group style={{ marginTop: "20px" }}>
              <Form.Input
                id="fundingComText"
                name="content"
                value={fundCom.content}
                onChange={onChange}
                placeholder="응원의 한마디 부탁드립니다!"
                required
                style={{
                  marginLeft: "40px",
                  width: "45vw",
                  marginRight: "20px",
                  fontSize: "1.1rem",
                }}
              />
              <Button
                icon="edit"
                style={{ width: "9vw", height: "2.9rem", marginRight: "0.8em" }}
              >
                등록하기
              </Button>
            </Form.Group>
          ) : (
            <Form.Group style={{ marginTop: "20px" }}>
              <Form.Input
                id="fundingComText"
                name="content"
                value="후원자만 댓글 작성 가능합니다."
                style={{
                  marginLeft: "40px",
                  width: "45vw",
                  marginRight: "20px",
                  fontSize: "1.1rem",
                }}
                disabled
              />
              <Button
                icon="edit"
                style={{ width: "9vw", height: "2.9rem", marginRight: "0.8em" }}
                disabled
              >
                등록하기
              </Button>
            </Form.Group>
          )}
        </Form>
        <FundingCommentList
          fundingCommentList={fundComData}
          deleteComment={deleteComment}
          modifyComment={modifyComment}
        />
      </Comment.Group>
    </Container>
  );
};

export default FundingComment;
