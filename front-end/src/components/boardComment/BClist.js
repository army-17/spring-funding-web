import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import BCdetail from "./BCdetail";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const BClist = () => {
  const nav = useNavigate();
  const nickname = sessionStorage.getItem("nickName");
  const boardNum = localStorage.getItem("boardNum");
  const [bcList, setBcList] = useState([]);

  useEffect(() => {
    // 댓글 리스트 가져오기
    axios
      .get("/board/comment/list", { params: { boardNum: boardNum } })
      .then((res) => {
        console.log(res.data);
        setBcList(res.data);
        console.log(bcList.length);
      });
  }, [bcList.length]);

  // 저장할 댓글 내용
  const [data, setData] = useState({
    content: "",
  });
  const { content } = data;

  // 댓글 내용 담기
  const onChange = useCallback(
    (e) => {
      const dataObj = {
        ...data,
        [e.target.name]: e.target.value,
      };
      setData(dataObj);
    },
    [data]
  );

  // 댓글 쓰기 처리
  const writeComment = (data, boardNum) => {
    if (nickname === null) {
      Swal.fire({
        icon: "error",
        iconColor: "#ff6666",
        title: "로그인이 필요합니다.",
        showConfirmButton: true,
        confirmButtonColor: "#ff6666",
      });
      nav("/login");
    } else {
      axios
        .post("/board/comment", data, { params: { boardNum: boardNum } })
        .then((res) => {
          console.log("write", data);
          setBcList([...bcList, res.data]);
          setData({ ...data, content: "" });
        });
    }
  };

  // 삭제 버튼 처리
  const bcDelete = (bcNum, writer) => {
    axios
      .delete("/board/comment", { params: { boardComNum: bcNum } })
      .then((res) => {
        const newCommentList = bcList.filter(
          (comment) => comment.boardComNum !== bcNum
        );
        setBcList(newCommentList);
        Swal.fire({
          icon: "success",
          iconColor: "#00b2b2",
          title: "댓글 삭제가 완료되었습니다.",
          showConfirmButton: true,
          confirmButtonColor: "#00b2b2",
        });
      })
      .catch((error) =>
        Swal.fire({
          icon: "error",
          iconColor: "#ff6666",
          title: "댓글 삭제가 실패되었습니다.",
          showConfirmButton: true,
          confirmButtonColor: "#ff6666",
        })
      );
  };

  // 수정 버튼 처리
  const bcUpdate = (bcNum, writer, content, callbackFunc) => {
    console.log("댓글 수정");
    axios
      .put(
        "/board/comment",
        { content: content },
        { params: { boardComNum: bcNum } }
      )
      .then((res) => {
        console.log("update res", res.data);
        const updatedComment = res.data;
        let newCommentList = [];
        for (let comment of bcList) {
          if (updatedComment.boardComNum === comment.boardComNum) {
            comment.content = content;
            newCommentList.push(comment);
          } else {
            newCommentList.push(comment);
          }
        }
        setBcList(newCommentList);
        callbackFunc();

        Swal.fire({
          icon: "success",
          iconColor: "#00b2b2",
          title: "댓글 수정이 완료되었습니다.",
          showConfirmButton: true,
          confirmButtonColor: "#00b2b2",
        });
      })
      .catch((error) =>
        Swal.fire({
          icon: "error",
          iconColor: "#ff6666",
          title: "댓글 수정이 실패되었습니다.",
          showConfirmButton: true,
          confirmButtonColor: "#ff6666",
        })
      );
  };

  // 댓글 리스트 출력
  let boardCommentList = null;
  if (bcList.length === 0) {
    boardCommentList = (
      <div style={{ paddingTop: "100px" }} key={0}>
        <h4 style={{ textAlign: "center", color: "#00b2b2" }}>
          댓글이 없습니다.
        </h4>
      </div>
    );
  } else {
    boardCommentList = Object.values(bcList).map((item, index) => (
      <div key={index}>
        <BCdetail
          bcNum={item.boardComNum}
          bcDate={item.date}
          writer={item.memberNum.nickname}
          content={item.content}
          bcDelete={bcDelete}
          bcUpdate={bcUpdate}
        />
      </div>
    ));
  }

  return (
    <div>
      <div>
        <fieldset
          style={{
            height: "180px",
            padding: "20px",
            border: "none",
            borderTop: "1px solid #e8e8e8",
            borderBottom: "1px solid #e8e8e8",
            backgroundColor: "#fafafa",
          }}
        >
          <textarea
            style={{
              width: "100%",
              height: "100px",
              resize: "none",
              position: "relative",
              padding: "12px 12px",
              border: "1px solid #e8e8e8",
              backgroundColor: "#fff",
              outline: "none",
            }}
            name="content"
            value={content}
            onChange={onChange}
            placeholder="댓글을 작성해주세요."
          ></textarea>
          <Button
            style={{
              float: "right",
              marginTop: "4px",
              width: "7vw",
              height: "2.9rem",
            }}
            onClick={() => writeComment(data, boardNum)}
          >
            작성
          </Button>
        </fieldset>
      </div>
      <div>{boardCommentList}</div>
    </div>
  );
};

export default BClist;
