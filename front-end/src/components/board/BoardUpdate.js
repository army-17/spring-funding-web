import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Header } from "semantic-ui-react";
import Swal from "sweetalert2";
import "./BoardUpdate.scss";

const BoardUpdate = () => {
  const nav = useNavigate();

  const boardList = () => {
    nav("/board/list");
  };

  let formData = new FormData();

  const [fileDeleteList, SetFileDeleteList] = useState([]);

  //localStorag에 저장한 내용 불러오기
  let getTitle = localStorage.getItem("title");
  let getContent = localStorage.getItem("content");
  const bNum = localStorage.getItem("boardNum");

  const [bfList, setBfList] = useState([
    {
      boardFileNum: 0,
      originName: "파일없음",
      sysName: "",
    },
  ]);

  //파일 리스트 불러오기
  useEffect(() => {
    axios
      .get("/board/file/list", { params: { boardNum: bNum } })
      .then((res) => {
        // console.log("파일 : " + res.data.length);
        if (res.data.length > 0) {
          let newFileList = [];
          for (let i = 0; i < res.data.length; i++) {
            const newFile = {
              ...res.data[i],
            };
            newFileList.push(newFile);
          }
          setBfList(newFileList);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const viewFlist = bfList.map((v, i) => {
    return (
      <div className="boardUpdFilesDown" id={v.boardFileNum} key={i}>
        {v.originName} &nbsp;
        {v.originName === "파일없음" ? null : (
          <button
            type="button"
            className="boardUpdFilesBtn"
            onClick={(e) => addDeleteFileList(e, v)}
          >x</button>
        )}
      </div>
    );
  });

  //자유게시판 개별 파일 삭제 기능
  const addDeleteFileList = useCallback(
    (e, v) => {
      fileDeleteList.push(v.boardFileNum);
      let fileDiv = document.getElementById(v.boardFileNum);
      fileDiv.remove();
      console.log(fileDeleteList);
    
      // if (e.target.checked) {
      //   fileDeleteList.push(v.boardFileNum);
      //   let fileDiv = document.getElementById(v.boardFileNum);
      //   fileDiv.remove();

      // } else {
      //   console.log("filedelete", fileDeleteList);
      //   const newList = fileDeleteList.filter(
      //     (fileNum) => fileNum !== v.boardFileNum
      //   );
      //   console.log(newList);
      //   SetFileDeleteList(newList);
      // }
    },
    [fileDeleteList]
  );

  //게시판 파일 추가 리스트
  const onFileChange = useCallback(
    (e) => {
      const files = e.target.files;
      //console.log(files);
      formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    },
    [formData]
  );

  //자유게시판 수정 기능

  const [data, setData] = useState({
    title: getTitle,
    content: getContent,
  });

  const { title, content } = data;

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



  //게시판 수정 
  const onUpdate = useCallback(
    (e) => {
      e.preventDefault();

      //게시판 글 수정
      axios
        .put("/board", data, { params: { boardNum: bNum } })
        .then((res) => {
          if (res.data === "수정 성공") {
          
            //*****게시글 파일 삭제******//
            // console.log("fileDeleteList : " + fileDeleteList.length);
            //삭제할 파일 존재할 때 실행
            if (fileDeleteList.length !== 0) {
              for (const v of fileDeleteList) {
                axios
                  .delete("/board/file", { params: { boardFileNum: v } })
                  .then((res) => {
                    console.log(res.data);
                    if (res.data === "파일 삭제 완료") {
                      const div = document.getElementById(v.boardFileNum);
                      div.remove();
                    }
                  })
                  .catch((err) => console.log(err));
                }
            }
            
            //*****게시글 파일 추가******//
            let keys = formData.keys();
            let i = 0;
            for (const key of keys) {
              i++;
              // console.log("key : " + key);
            }
            

            //추가할 파일이 존재할 경우
            if (i !== 0) {
              axios
                .post("/board/file", formData, { params: { boardNum: bNum } },
                  {headers: { "Content-Type": "multipart/form-data" },
                  })
                .then((res) => {
                  Swal.fire({
                    icon: "success",
                    iconColor: "#00b2b2",
                    title: "게시글 수정이 완료되었습니다.",
                    showConfirmButton: true,
                  })
                  nav("/board/detail");
                })
                .catch((err) => console.log(err));
            }
            //추가할 파일이 없을 경우
            else {
                Swal.fire({
                  icon: "success",
                  iconColor: "#00b2b2",
                  title: "게시글 수정이 완료되었습니다.",
                  showConfirmButton: true,
                })
                nav("/board/detail"); 
            }

          } else {
            Swal.fire({
              icon: "error",
              iconColor: "#ff6666",
              title: "게시글 수정이 실패되었습니다.",
              showConfirmButton: true,
            })
          }
        })
        .catch((error) => console.log(error));
    },
    [data, fileDeleteList, formData]
  );


  return (
    <Container style={{ marginTop: "30px", width: "60vw" }}>
      <Header
        as="h1"
        style={{ marginTop: "50px", textAlign: "left", marginBottom: "50px"}}
      >
        <p style={{ color: "#00b2b2", display: "inline", fontSize: "32px", marginRight:"5px" }} >와디즈IT</p>
        <p style={{ display: "inline", fontSize:"22px" }}>의 자유게시판</p>
      </Header>
      <div className="boardForm">
        <form onSubmit={onUpdate}>
          <input
            className="buTitle"
            type="text"
            name="title"
            value={title}
            onChange={onChange}
          ></input>
          <br />
          <textarea
            className="buContent"
            type="text"
            name="content"
            value={content}
            onChange={onChange}
            required
          ></textarea>
          <br />
          <div className="buFile">
            <div className="buFileListArea">
              <div className="buFileTitle">
                첨부파일
              </div>
              <div className="buFileList">{viewFlist}</div>
            </div>
            <div className="buFileAdd">
              <input id="fileAddBtn"
                type="file" name="files" onChange={onFileChange} multiple />
            </div>
            
          </div>
          
          <div className="btn" style={{marginTop:"0px"}}>
            <div className="upBtnArea" style={{width:"60vw"}}>
            <Button
          type="button" className="backBtn"
          onClick={boardList}
          style={{
            alignItems: "center",
            margin: "0px",
            border: "1px solid #00b2b2",
            backgroundColor: "#ffffff",
            color: "#00b2b2",
            float:"left",
            display:"inline-block"
          }}
        >
          돌아가기
              </Button>
              <Button
          type="button" className="writeBtn"
          onClick={onUpdate}
          style={{
            alignItems: "center",
            margin: "0px",
            border: "1px solid #00b2b2",
            backgroundColor: "#ffffff",
            color: "#00b2b2",
            display:"inline-block"
          }}
        >
          수정하기
              </Button>

            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default BoardUpdate;
