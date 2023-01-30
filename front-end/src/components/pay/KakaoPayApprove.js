import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "semantic-ui-react";

const df = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");
const orderDate = (date) => moment(date).format("YYYYMMDDHHmmss");

const KakaoPayApprove = () => {
  // 현재 링크에서 pg_token 값을 찾아줌
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("pg_token"));

  // 승인 결과를 담는 변수
  const [resApprove, setResApprove] = useState([]);

  const info = {
    paid: localStorage.getItem("paid"),

    params: {
      cid: "TC0ONETIME",
      tid: localStorage.getItem("tid"),
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      pg_token: searchParams.get("pg_token"),
    },
  };

  useEffect(() => {
    // 카카오 서버에 접근해 결제가 완료된 info를 받아 승인
    axios
      .post("https://kapi.kakao.com/v1/payment/approve", info.params, {
        headers: {
          Authorization: "KakaoAK 11f3dec5d0d5631d7d220eb80c7db83c",
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
      .then((res) => {
        console.log(res.data);
        setResApprove(res.data);
      });

    // 결제된 포인트 금액 db에 반영
    axios
      .put("/member/point?point=" + info.paid)
      .then((res) => {})
      .catch((err) => console.log(err));

    // 결제 내역 db에 저장
    axios
      .get("/payment", {
        params: {
          oNum: "wadizit" + orderDate(resApprove.approved_at),
          oName: localStorage.getItem("name"),
          date: df(resApprove.approved_at),
        },
      })
      .then((res) => {})
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        width: "60vw",
        display: "inline-block",
        borderRadius: "20px",
        marginTop: "80px",
        backgroundColor: "#effafa",
      }}
    >
      <div>
        <img
          style={{
            marginTop: "60px",
            width: "110px",
            height: "110px",
            float: "center",
          }}
          src="/asset/check-img.png"
        />
        <h2>구매가 완료되었습니다.</h2>
      </div>
      <div style={{ margin: "90px 0 60px 0" }}>
        <h4
          style={{
            margin: "0 auto",
            width: "250px",
            textAlign: "left",
            color: "#00b2b2",
          }}
        >
          결제 상품
        </h4>
        <h4
          style={{
            margin: "0 auto",
            width: "250px",
            textAlign: "left",
            marginBottom: "30px",
          }}
        >
          {resApprove.item_name}
        </h4>
        <h4
          style={{
            margin: "0 auto",
            width: "250px",
            textAlign: "left",
            color: "#00b2b2",
          }}
        >
          결제 시간
        </h4>
        <h4
          style={{
            margin: "0 auto",
            width: "245px",
            textAlign: "left",
          }}
        >
          {df(resApprove.approved_at)}
        </h4>
      </div>
      <div style={{ marginBottom: "60px" }}>
        <Link to="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
};

export default KakaoPayApprove;
