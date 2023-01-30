import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const KakaoPayReady = ({ price }) => {
  // 현재 로그인한 사용자 정보
  const loginPerson = sessionStorage.getItem("memberNum");

  // 결제 준비 단계에서 리턴받을 값들을 저장하는 변수
  const [payParam, setPayParams] = useState([]);

  const nav = useNavigate();

  const payBtn = () => {
    if (loginPerson === null) {
      Swal.fire({
        icon: "error",
        iconColor: "#ff6666",
        title: "로그인이 필요합니다.",
        showConfirmButton: true,
        confirmButtonColor: "#ff6666",
      });
      nav("/login");
    } else {
      // 카카오 서버에 접근해 결제하고자 하는 info를 받아 준비 내용을 리턴
      axios
        .post("https://kapi.kakao.com/v1/payment/ready", price.params, {
          headers: {
            Authorization: "KakaoAK 11f3dec5d0d5631d7d220eb80c7db83c",
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
        .then((res) => {
          const {
            data: { next_redirect_pc_url, tid, created_at },
            // 결제 준비 링크, 결제 고유 id, 결제 링크 생성일자
          } = res;

          setPayParams({ next_redirect_pc_url, tid, created_at });

          // 결제 고유 id를 session 저장
          localStorage.setItem("tid", tid);
          localStorage.setItem("paid", price.params.total_amount);
          localStorage.setItem("name", price.params.item_name);

          // 결제 준비 링크로 이동
          window.location.href = next_redirect_pc_url;
          console.log(next_redirect_pc_url);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button
          style={{
            background: "url(/asset/kakaopay-btn.png) no-repeat",
            height: "40px",
            width: "201px",
            border: "0",
            float: "right",
          }}
          onClick={() => payBtn()}
        ></button>
      </div>
    </div>
  );
};

export default KakaoPayReady;
