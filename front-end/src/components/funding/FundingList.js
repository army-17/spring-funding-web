import React, { useCallback, useRef, useEffect, useState } from "react";
// import React from 'react';
import {
  Button,
  Card,
  Container,
  Dropdown,
  Grid,
  Image,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useNavigate } from "react-router";
import axios from "axios";
import SimpleSlider from "../common/SimpleSlider";
import Loading from "../common/Loading";
import FundingProgressBar from "./FundingProgressBar";
import Swal from "sweetalert2";

const FundingList = () => {
  const nav = useNavigate();
  const [fundingItem, setFundingItem] = useState([]);
  const [page, setPage] = useState(1);
  const preventRef = useRef(true);
  const obsRef = useRef(null);
  const endRef = useRef(false);
  const [loading, setLoading] = useState(null);
  // const loginPerson = sessionStorage.getItem("memberNum");
  const loginKakaoPerson = sessionStorage.getItem("nickName");
  const [select, setSelect] = useState(0);
  const [resultSort, setResultSort] = useState(0);
  const style = { color: "red" };

  // 게시글 목록을 서버로부터 가져오는 함수
  // sort 와 select 값 비교 추가
  const getList = useCallback(
    (select) => {
      setLoading(true);
      axios
        .get("/funding/page", {
          params: { pageNum: page, sort: select },
        })
        .then((res) => {
          console.log(res);
          const { fffList, pageNum, end, sort } = res.data;

          // 마지막 페이지일 경우
          if (end) {
            endRef.current = true;
          } else {
            endRef.current = false;
          }

          // ------- select 0, 1 일 때
          if (select.toString() !== "2") {
            let arr = [];
            if (fundingItem.length !== 0) {
              if (select.toString() === resultSort.toString()) {
                fundingItem.map((x) => {
                  arr.push(x);
                  return x;
                });
              }
            }
            fffList.map((x) => {
              if (x.fundingFileList.length !== 0) {
                x.funding.fileName = "/upload/" + x.fundingFileList[1].sysName;
              }
              arr.push(x.funding);
              return x;
            });
            setResultSort(sort);
            setFundingItem(arr);
            sessionStorage.setItem("pageNum", pageNum);
            preventRef.current = true;
            setLoading(false);
          }

          // ------- select 2 일 때 (SQL 쿼리문으로 페이징 처리)
          else if (select.toString() === "2") {
            let arr = [];
            if (fundingItem.length !== 0) {
              if (select.toString() === resultSort.toString()) {
                fundingItem.map((x) => {
                  arr.push(x);
                  return x;
                });
              }
            }
            fffList.map((x) => {
              if (x.fundingFileList.length !== 0) {
                x.fundingRateInterface.fileName =
                  "/upload/" + x.fundingFileList[1]?.sysName;
              }
              arr.push(x.fundingRateInterface);
              return x;
            });
            setResultSort(sort);
            setFundingItem(arr);
            sessionStorage.setItem("pageNum", pageNum);
            preventRef.current = true;
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    },
    [page, fundingItem]
  );

  useEffect(() => {
    // getList(select);
    const observer = new IntersectionObserver(obsHandler, { threshold: 0.5 });
    if (obsRef.current) observer.observe(obsRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (page !== 1) getList(select);
  }, [page]);

  useEffect(() => {
    getList(select);
  }, [select]);

  const obsHandler = (entries) => {
    const target = entries[0];
    if (!endRef.current && target.isIntersecting && preventRef.current) {
      preventRef.current = false;
      setPage((prev) => prev + 1);
    }
  };

  //펀딩 카드 클릭하면 해당 펀딩 상세로 이동함
  const getFundingDetail = useCallback(
    (fundingNum, fundingOwner) => {
      // 보여질 펀딩 글의 번호, 펀딩 소유자 번호를 localStorage에 저장
      localStorage.setItem("fundingNum", fundingNum);
      localStorage.setItem("fundingOwner", fundingOwner);
      nav("/funding/detail");
    },
    [nav]
  );

  // progress
  const getCompleteRate = (item) => {
    return Math.floor(
      (parseFloat(item.currentAmount) / parseFloat(item.targetAmount)) * 100
    );
  };

  // d-day
  const getDiffDate = (item) => {
    var today = new Date();
    var endDateFormat = new Date(item.endDate);
    var diff = endDateFormat - today;
    const dDay = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    if (dDay > 0) {
      // var x = document.getElementById("dDayCard");
      // x.style.color = "#495057";
      return dDay + "일 남음";
    } else if (dDay === 0) {
      return "마감 임박";
    } else {
      return "토큰 거래 진행 중";
    }
  };

  //금액 쉼표 표시
  const currentAmtFormat = (item) => {
    return item.currentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //로그인을 해야만 펀딩 생성이 가능
  const fundingWrite = () => {
    if (loginKakaoPerson === null) {
      Swal.fire({
        icon: "error",
        iconColor: "#ff6666",
        title: "로그인이 필요합니다.",
        showConfirmButton: true,
        confirmButtonColor: "#ff6666",
      });
      nav("/login");
    } else {
      nav("/funding/terms");
    }
  };

  // select(dropdown option)
  const selectOptions = [
    {
      key: "0",
      text: "최근등록순",
      value: "0",
    },
    {
      key: "1",
      text: "마감임박순",
      value: "1",
    },
    {
      key: "2",
      text: "목표금액 달성순",
      value: "2",
    },
    {
      key: "3",
      text: "토큰 거래 진행 중",
      value: "3",
    },
  ];

  const onSelectMain = (event, data) => {
    setPage(1);
    setSelect(() => data.value);
    // getList(data.value);
  };

  // 출력될 fundingCard form
  const FundingCard = () => {
    return Object.values(fundingItem).map((item) => {
      return (
        <Grid.Column key={item.fundingNum}>
          <Card
            fluid
            onClick={() => {
              console.log("item", item);
              getFundingDetail(item.fundingNum, item.memberNum.memberNum);
            }}
          >
            {/* fileName 없을 경우 대체이미지 출력 */}
            {item.fileName ? (
              <Image
                style={{ height: 300, objectFit: "cover" }}
                src={item.fileName}
              />
            ) : (
              <Image
                style={{ height: 300, objectFit: "cover" }}
                src="asset/img1.jpg"
              />
            )}

            <Card.Content>
              <Card.Header style={{ height: "80px" }}>{item.title}</Card.Header>
              <FundingProgressBar completed={getCompleteRate(item)} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  {/* 달성률 */}
                  <Card.Header style={{ color: "#00b2b2", fontSize: "17px" }}>
                    <b>{getCompleteRate(item)}%</b>
                  </Card.Header>
                  {/* 현재 모금액 */}
                  <Card.Meta style={{ marginLeft: "10px", color: "#495057" }}>
                    <b>{currentAmtFormat(item)}원</b>
                  </Card.Meta>
                </div>
                <div>
                  {/* 잔여 기한 */}
                  <Card.Meta id="dDayCard" style={{ color: "#495057" }}>
                    <b>{getDiffDate(item)}</b>
                  </Card.Meta>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      );
    });
  };

  return (
    <Container>
      <Segment placeholder style={{ margin: 0, padding: 0 }}>
        <SimpleSlider />
      </Segment>
      {fundingItem.length === 0 && <div style={{ height: "100vh" }}></div>}
      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0 10px 0",
        }}
      >
        {/* dropdown section */}
        <Dropdown
          onChange={onSelectMain}
          defaultValue="0"
          selection
          options={selectOptions}
        />

        <Button
          onClick={fundingWrite}
          style={{
            alignItems: "center",
            margin: "0px",
            border: "1px solid #00b2b2",
            backgroundColor: "#ffffff",
            color: "#00b2b2",
          }}
        >
          프로젝트 만들기
        </Button>
      </Container>
      <Grid doubling columns={3}>
        <FundingCard />
      </Grid>
      {loading && <Loading />}
      <div ref={obsRef} />
    </Container>
  );
};

export default FundingList;
