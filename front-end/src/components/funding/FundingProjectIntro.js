import React, { useEffect, useState } from "react";
import axios from "axios";

import { Image, Segment } from "semantic-ui-react";

const FundingProjectIntro = () => {
  const [imgCompList, setImgCompList] = useState([]);
  const fundingNum = localStorage.getItem("fundingNum");

  //펀딩 상세정보 출력
  useEffect(() => {
    let imgList = [];
    axios
      .get("/funding/file/list", { params: { fundingNum: fundingNum } })
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].fileType === 2) {
            console.log("소개 파일");
            console.log("/upload/" + res.data[i].sysName);
            imgList.push("/upload/" + res.data[i].sysName);
          }
        }

        setImgCompList(
          Object.values(imgList).map((src, index) => (
            <div key={index}>
              <Image src={src} centered />
            </div>
          ))
        );

        console.log("imgList", imgCompList);
      });
  }, []);

  return (
    <>
      <Segment>{imgCompList}</Segment>
    </>
  );
};

export default FundingProjectIntro;
