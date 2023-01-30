import React, { useEffect } from "react";
import axios from 'axios';
// import Main from "./Main";

const KakaoRedirectHandler = ({setKakaoData}) => {
  useEffect(() => {
    let params = new URL(document.location.toString()).searchParams;
    let code = params.get("code"); // 인가코드 받는 부분
    
    axios
      .get(`http://localhost:3000/oauth/kakao?code=${code}`)
      .then((res) => {
        setKakaoData(res.data)
        //sessionStorage.setItem("nickName", res.data.nickname)
          // res에 포함된 토큰 받아서 원하는 로직을 하면된다.
      })
  }, [setKakaoData])

  return <div/>
};

export default KakaoRedirectHandler;