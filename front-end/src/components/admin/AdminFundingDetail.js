import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import Button from "../common/Button";
import Afunding from "./Afunding";
import Swal from "sweetalert2";

const AdminFundingDetail = () => {
  const [fundingDetail, setFundingDetail] = useState([]);
  const fundingNum = localStorage.getItem("fundingNum");

  const [ffList, setFfList] = useState([
    {
      fundingFileNum: 0,
      fileType: 0,
      originName: "파일없음",
      sysName: "",
      image: "",
    },
  ]);

  useEffect(() => {
    // 서버로부터 해당 펀딩 내용 가져오기
    axios
      .get("/funding", { params: { fundingNum: fundingNum } })
      .then((res) => {
        setFundingDetail(res.data);
      })
      .catch((err) => console.log(err));

    // 서버로부터 해당 사업자 파일 가져오기
    axios
      .get("/funding/file/list", { params: { fundingNum: fundingNum } })
      .then((res) => {
        console.log("파일 : " + res.data.length);
        if (res.data.length > 0) {
          let newFileList = [];
          for (let i = 0; i < res.data.length; i++) {
            localStorage.setItem("ffileAmount", res.data.length);
            localStorage.setItem("ffNum" + i, res.data[i].fundingFileNum);
            localStorage.setItem("fileName" + i, res.data[i].originName);
            const newFile = {
              ...res.data[i],
              image: "/upload/" + res.data[i].sysName,
            };
            newFileList.push(newFile);
          }
          setFfList(newFileList);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // 승인 버튼 처리
  const approveBtn = (fundingNum) => {
    let newfd = { ...fundingDetail };
    newfd.status = "승인";
    console.log(newfd);

    // fundingNum은 수정할 현재 funding / funding은 수정된 내용
    // fundingNum을 이용해 기존의 내용을 수정된 내용인 funding으로 덮는다

    axios
      .put("/funding", newfd, { params: { fundingNum: fundingNum } })
      .then((res) => {
        if (res.data === "수정 성공") {
          Swal.fire({
            icon: "success",
            iconColor: "#00b2b2",
            title: "해당 펀딩이 승인되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#00b2b2",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // 반려 버튼 처리
  const rejectBtn = (fundingNum) => {
    let newfd = { ...fundingDetail };
    newfd.status = "반려";
    console.log(newfd);

    axios
      .put("/funding", newfd, { params: { fundingNum: fundingNum } })
      .then((res) => {
        if (res.data === "수정 성공") {
          Swal.fire({
            icon: "success",
            iconColor: "#00b2b2",
            title: "해당 펀딩이 반려되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#00b2b2",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // 파일 이름 처리
  const extractDownloadFilename = (data) => {
    const disposition = data.headers["content-disposition"];
    const fileName = decodeURI(
      disposition
        .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
        .replace(/['"]/g, "")
    );
    return fileName;
  };

  // 파일 다운로드 처리함수
  const onDown = useCallback((v) => {
    //console.log(v);
    if (v.originName === "파일없음") {
      return;
    }
    axios
      .get("/funding/file/download", {
        params: { fundingFileNum: v.fundingFileNum },
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

  // 파일 이름 리스트
  const viewFlist = ffList.map((v, i) => {
    // console.log("파일 이름 : " + v.originName);
    return (
      <div className="fileDown" key={i} onClick={() => onDown(v)}>
        <img src="/asset/clipIcon.png" alt="" width="10px"></img>
        {v.originName}
      </div>
    );
  });

  return (
    <Container>
      <div
        style={{
          marginTop: "60px",
          display: "flex",
          height: "55px",
          borderBottom: "3px solid #00b2b2",
        }}
      >
        <h3 style={{ width: "60%", textAlign: "left", lineHeight: "55px" }}>
          펀딩 승인/반려
        </h3>
        <div
          style={{
            width: "40%",
            display: "inline-block",
            textAlign: "right",
            lineHeight: "55px",
          }}
        >
          <Button
            style={{
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
              width: "5vw",
              lineHeight: "0",
            }}
            onClick={() => approveBtn(fundingDetail.fundingNum)}
          >
            승인
          </Button>
          <Button
            style={{
              border: "1px solid #ff6666",
              backgroundColor: "#ffffff",
              color: "#ff6666",
              width: "5vw",
              marginLeft: "5px",
              lineHeight: "0",
            }}
            onClick={() => rejectBtn(fundingDetail.fundingNum)}
          >
            반려
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: "55px",
          borderBottom: "3px solid #00b2b2",
        }}
      >
        <h3 style={{ width: "60%", textAlign: "left", lineHeight: "55px" }}>
          사업자 파일
        </h3>
        <div
          style={{
            width: "40%",
            display: "inline-block",
            textAlign: "right",
            lineHeight: "55px",
          }}
        >
          {viewFlist[0]}
        </div>
      </div>
      <Afunding fundingNum={fundingNum}></Afunding>
    </Container>
  );
};

export default AdminFundingDetail;
