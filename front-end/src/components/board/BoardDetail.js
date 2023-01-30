import axios from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BoardDetail.scss";
import { Button, Container, Header } from "semantic-ui-react";
import BClist from "../boardComment/BClist";
import Loading from "../common/Loading";
import Swal from "sweetalert2";

const dateFormat = (date) => moment(date).format("YYYY월 MM월 DD일");

const BoardDetail = () => {

  //로그인한 사람과 글 작성자에 대한 세션 정보 받기
  const loginPerson = sessionStorage.getItem("memberNum");
  const boardWriter = sessionStorage.getItem("boardWriter");
  //로딩 상태
  const [loading, setLoading] = useState(null);
  //게시판 번호
  const bNum = localStorage.getItem("boardNum");
  //게시글 정보
  const [bitem, setBitem] = useState({
    title: "",
    memberNum: {},
    content: "",
  });
  //게시글 파일 정보
  const [bfList, setBfList] = useState([
    {
      boardFileNum: 0,
      originName: "파일없음",
      sysName: "",
      image: "",
    },
  ]);
  
  const nav = useNavigate();
  const boardList = () => {
    nav("/board/list");
  };

  const boardUpdate = () => {

    if (loginPerson === boardWriter) {

      Swal.fire({
        title: "글을 수정하시겠습니까?",
        icon: "question",
        iconColor: "#00b2b2",
        showCancelButton: true,
        confirmButtonText: "확인",
        confirmButtonColor: "#00b2b2",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          nav("/board/update");
        }
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/board", { params: { boardNum: bNum } })
      .then((res) => {
        console.log("데이터 : " + res.data);
        setBitem(res.data);

        //글 작성자 정보 남기기
        sessionStorage.setItem("boardWriter", res.data.memberNum.memberNum);
      })
      .catch((err) => console.log(err));

    axios
      .get("/board/file/list", { params: { boardNum: bNum } })
      .then((res) => {
        console.log("파일 : " + res.data.length);

        if (res.data.length > 0) {
          let newFileList = [];
          for (let i = 0; i < res.data.length; i++) {
            localStorage.setItem("fileAmount", res.data.length);
            localStorage.setItem("bfNum" + i, res.data[i].boardFileNum);
            localStorage.setItem("fileName" + i, res.data[i].originName);
            const newFile = {
              ...res.data[i],
              image: "/upload/" + res.data[i].sysName,
            };
            newFileList.push(newFile);
          }
          setBfList(newFileList);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  //파일 이름 처리
  const extractDownloadFilename = (data) => {
    const disposition = data.headers["content-disposition"];
    const fileName = decodeURI(
      disposition
        .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
        .replace(/['"]/g, "")
    );
    return fileName;
  };

  //파일 다운로드 처리함수
  const onDown = useCallback((v) => {
    //console.log(v);
    if (v.originName === "파일없음") {
      return;
    }
    axios
      .get("/board/file/download", {
        params: { boardFileNum: v.boardFileNum },
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data]);

        const fileObjectUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileObjectUrl;
        link.style.display = "none";

        link.download = extractDownloadFilename(res);

        document.body.appendChild(link);
        link.click();
        link.remove();

        // 다운로드가 끝난 리소스(객체 URL) 해제
        window.URL.revokeObjectURL(fileObjectUrl);
      })
      .catch((err) => console.log(err));
  });

  //파일 이름 리스트
  const viewFlist = bfList.map((v, i) => {
    // console.log("파일 이름 : " + v.originName);
    return (
      <div className="fileDown" key={i} onClick={() => onDown(v)}>
        <img
          src="../asset/clipIcon.png"
          alt="사진없음"
          style={{ width: "14px", height: "auto" }}
        ></img>
        {v.originName}
      </div>
    );
  });

  //파일 이미지 띄우기
  const imageFlist = bfList.map((v, i) => {
    //이미지 확장자 확인
    const extension = v.originName
      .slice(v.originName.indexOf(".") + 1)
      .toLowerCase();

    if (v.originName === "파일없음") {
      return null;
    } else if (
      extension !== "jpg" &&
      extension !== "jpeg" &&
      extension !== "png"
    ) {
      return null;
    } else {
      return (
        <div className="fileImage" key={i}>
          <img
            src={v.image}
            alt="사진없음"
            style={{ width: "13rem", height: "auto" }}
          ></img>
        </div>
      );
    }
  });

  // //게시글 전체 삭제 함수 (게시글 + 파일 + 댓글)
  // const boardDeleteAll = () => {

  //   console.log("파일이름~~~ : " + bfList[0].originName)

  //   if (loginPerson === boardWriter) {
  //     let result = window.confirm("정말로 삭제하시겠습니까?");
  //     if (result === true) {
  //       axios
  //         .delete("/board/comment/deleteAll", { params: { boardNum: bNum } })
  //         .then((res) => {
  //           if (res.data === "댓글 전체 삭제" || res.data === "댓글없음") {
  //             boardFileDelete(bNum);
  //             for (var i = 0; i < 1; i++){
  //               boardDelete(bNum);
  //             }

  //           } else {
  //             alert("댓글 삭제 실패하였습니다.");
  //           }
  //         })
  //         .catch((err) => console.log(err));

  //     }
  //   } else {
  //     alert("글 작성자만 삭제 가능합니다.");
  //     }
  // }

  // //게시글 파일 삭제 함수
  // const boardFileDelete = (bNum) => {

  //   if (bfList[0].originName !== "파일없음") {
  //     axios
  //     .delete("/board/file/deleteAll", { params: { boardNum: bNum } })
  //     .then((res) => {
  //       if (res.data === "파일 삭제 완료") {
  //         alert("파일 삭제 완료");
  //       }
  //       else {
  //         alert("파일 삭제 실패");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  //   }
  // }

  //게시글 삭제 함수
  const boardDelete = () => {
    axios
      .delete("/board", { params: { boardNum: bNum } })
      .then((res) => {
        if (res.data === "삭제 성공") {
          Swal.fire({
            icon: "success",
            iconColor: "#00b2b2",
            title: "게시글 삭제가 완료되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#00b2b2",
          });
          nav("/board/list");
        } else {
          Swal.fire({
            icon: "error",
            iconColor: "#ff6666",
            title: "게시글 삭제가 실패되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#ff6666",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  //게시글 전체 삭제 (boardComment + boardFile + board)
  const boardDeleteAll = () => {
    if (loginPerson === boardWriter) {
      Swal.fire({
        title: "정말로 삭제하시겠습니까?",
        icon: "question",
        iconColor: "#00b2b2",
        showCancelButton: true,
        confirmButtonText: "확인",
        confirmButtonColor: "#00b2b2",
        cancelButtonText: "취소",
        cancelButtonColor: "#ff6666",
      }).then((result) => {
        if (result.isConfirmed) {
          if (bfList[0].originName !== "파일없음") {
            //게시글 파일 삭제
            axios
              .delete("/board/file/deleteAll", { params: { boardNum: bNum } })
              .then((res) => {
                if (res.data === "파일 삭제 완료") {
                  //게시글 댓글 삭제
                  axios
                    .delete("/board/comment/deleteAll", {
                      params: { boardNum: bNum },
                    })
                    .then((res) => {
                      if (
                        res.data === "댓글 전체 삭제" ||
                        res.data === "댓글없음"
                      ) {
                        boardDelete();
                      } else {
                        Swal.fire({
                          icon: "error",
                          iconColor: "#ff6666",
                          title: "게시글 삭제가 실패되었습니다.",
                          showConfirmButton: true,
                          confirmButtonColor: "#ff6666",
                        });
                      }
                    })
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => console.log(err));
          } else {
            axios
              .delete("/board/comment/deleteAll", {
                params: { boardNum: bNum },
              })
              .then((res) => {
                if (res.data === "댓글 전체 삭제" || res.data === "댓글없음") {
                  boardDelete();
                } else {
                  Swal.fire({
                    icon: "error",
                    iconColor: "#ff6666",
                    title: "게시글 삭제가 실패되었습니다.",
                    showConfirmButton: true,
                    confirmButtonColor: "#ff6666",
                  });
                }
              })
              .catch((err) => console.log(err));
          }
        }
      });
    }
  };
  //상세페이지 내용 localStorage에 저장
  localStorage.setItem("title", bitem.title);
  localStorage.setItem("writer", bitem.memberNum.nickname);
  localStorage.setItem("content", bitem.content);

  return (
    <Container style={{ marginTop: "30px", width: "60vw" }}>
      <Header
        style={{
          backgroundColor: "#00b2b2",
          color: "#ffffff",
          marginTop: "7.5px",
          paddingLeft: "20px",
          height: "40px",
          lineHeight: "40px",
          textAlign: "left",
        }}
        as="h3"
      >
        자유게시판
      </Header>
      <Container style={{ paddingTop: "2vw" }}>
        <div className="bdBoardForm">
          <div className="bdTitle">{bitem.title}</div>
          <div className="bdInfo">
            <div className="bdInfoArea">
              <div className="bdWriter">
                작성자 : {bitem.memberNum.nickname}&nbsp;&nbsp;&nbsp;|
              </div>
              <div className="bdDate">
                작성일 : {dateFormat(bitem.date)}&nbsp;&nbsp;&nbsp;|
              </div>
              <div className="bdView">조회수&nbsp;{bitem.view}</div>
            </div>
          </div>

          <div className="bdContent">
            {imageFlist}
            {bitem.content}
          </div>
          <div className="bdFileInfo">
            <div className="bdFileTitle">첨부파일</div>
            <div className="bdFileList">{viewFlist}</div>
          </div>
        </div>
        {loading && <Loading />}

        <div className="bdBtn">
          <Button
            type="button"
            className="bdBackBtn"
            onClick={boardList}
            style={{
              alignItems: "center",
              margin: "0px",
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
            }}
          >
            돌아가기
          </Button>
          {!(loginPerson === boardWriter) ? null : (
            <div className="bdBtnArea">
              <Button
                type="button"
                className="bdUpdateBtn"
                onClick={boardUpdate}
                style={{
                  alignItems: "center",
                  margin: "0px",
                  border: "1px solid #00b2b2",
                  backgroundColor: "#ffffff",
                  color: "#00b2b2",
                }}
              >
                수정
              </Button>

              <Button
                type="button"
                className="bdDeleteBtn"
                onClick={boardDeleteAll}
                style={{
                  alignItems: "center",
                  margin: "0px",
                  marginLeft: "10px",
                  border: "1px solid #00b2b2",
                  backgroundColor: "#ffffff",
                  color: "#00b2b2",
                }}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
        <div>
          <BClist></BClist>
        </div>
      </Container>
    </Container>
  );
};

export default BoardDetail;
