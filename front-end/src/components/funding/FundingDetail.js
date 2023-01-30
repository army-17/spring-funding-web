import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import {
  Container,
  Image,
  Tab,
  Grid,
  Header,
  Segment,
} from "semantic-ui-react";
import FundingComment from "../fundingComment/FundingComment";
import FundingProjectIntro from "./FundingProjectIntro";
import TokenTransaction from "../token/TokenTransaction";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import FundingModal from "./FundingModal";
import { useNavigate } from "react-router-dom";
import Goods from "../goods/Goods";
import Swal from "sweetalert2";

const panes = [
  {
    menuItem: "프로젝트 소개",
    render: () => (
      <Tab.Pane attached={false}>{<FundingProjectIntro />}</Tab.Pane>
    ),
  },
  {
    menuItem: "커뮤니티",
    render: () => <Tab.Pane attached={false}>{<FundingComment />}</Tab.Pane>,
  },
  {
    menuItem: "토큰 거래",
    render: () => <Tab.Pane attached={false}>{<TokenTransaction />}</Tab.Pane>,
  },
  {
    menuItem: "굿즈",
    render: () => <Tab.Pane attached={false}>{<Goods />}</Tab.Pane>,
  },
];

const TabMenu = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
);

const dateFormat = (date) => moment(date).format("YYYY.MM.DD");

const FundingDetail = () => {
  const nav = useNavigate();
  const fundingNum = localStorage.getItem("fundingNum");

  //펀딩 상세정보 데이터
  const [fundData, setFundData] = useState({
    currentAmount: 0,
    targetAmount: 0,
    title: "",
    startDate: "",
    endDate: "",
    status:""
  });

  //펀딩 디데이 계산
  var today = new Date();
  var endDateFormat = new Date(fundData.endDate);
  var diff = endDateFormat - today;
  var diffDay = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  var diffDay2 = diffDay;
  if (diffDay === 0) {
    diffDay = "오늘 마감";
    diffDay2 = "오늘 마감";

    if (diffDay === "오늘 마감") {
      var x = document.getElementById("diffDayCount");
      x.style.color = "#e94e58";
    }
  } else if (diffDay > 0) {
    diffDay += "일";
    diffDay2 += "일 남음";
  } else {
    diffDay = "종료";
    diffDay2 = "종료";

  }

  //펀딩 달성률 %(소수점 처리)
  let achieveRate =
    (parseFloat(fundData.currentAmount) / parseFloat(fundData.targetAmount)) *
    100;
  // console.log("달성률" + achieveRate);

  if (achieveRate === 0) {
    achieveRate = 0;
  } else if (achieveRate < 1) {
    achieveRate = achieveRate.toFixed(1);
  } else if (achieveRate >= 1) {
    achieveRate = achieveRate.toFixed(0);
  }

  //금액 쉼표 표시
  let currentAmtFormat = fundData.currentAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let targetAmtFormat = fundData.targetAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //progress bar 애니메이션
  const [completeRate, setCompleteRate] = useState(0);

  //펀딩 대표이미지
  const [thumbNail, setThumbNail] = useState([
    {
      imageRoute: "",
    },
  ]);

  //로그인한 사람의 정보
  const loginPerson = sessionStorage.getItem("memberNum");
  //펀딩 후원자 정보 데이터
  const [donator, setDonator] = useState([]);
  //펀딩 후원자 판단
  const [isDonator, setIsDonator] = useState(false);
  //펀딩 모달창 띄위기
  const [modalOpen, setModalOpen] = useState(false);
  //펀딩 토큰 정보 데이터
  const [fundToken, setFundToken] = useState({
    listingPrice: 0,
    name: "",
  });

  //펀딩 상세정보 출력
  useEffect(() => {
    //펀딩 대표 이미지 출력
    axios
      .get("/funding/file/list", { params: { fundingNum: fundingNum } })
      .then(
        (res) => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].fileType === 1) {
              let newFileList = [];
              const newFile = {
                imageRoute: "/upload/" + res.data[i].sysName,
              };
              newFileList.push(newFile);
              setThumbNail(newFileList);
            }
          }
        },
        [thumbNail]
      );

    //펀딩 상세정보 출력
    axios
      .get("/funding", { params: { fundingNum: fundingNum } })
      .then((res) => {
        console.log("상태" + res.data.status);
        setFundData(res.data);
      })
      .catch((err) => console.log(err));

    setTimeout(() => setCompleteRate(achieveRate), 1000);

    //펀딩 토큰 상세정보 출력
    axios
      .get("/token/fundToken", { params: { fundingNum: fundingNum } })
      .then((res) => {
        console.log(res.data);
        setFundToken(res.data);
        sessionStorage.setItem("tokenName", res.data.name);
      });
    // console.log("fundToken" + fundToken.tokenNum);

    //펀딩 후원자 정보 출력
    axios
      .get("/donate/getFundingPerson", { params: { fundingNum: fundingNum } })
      .then((res) => {
        let donatorList = [];
        for (let i = 0; i < res.data.length; i++) {
          donatorList.push(res.data[i]);
          setDonator(donatorList);
        }

        if (donator.length > 0) {
          console.log(donator);
          console.log(loginPerson);
          for (let i = 0; i < donator.length; i++) {
            if (parseInt(loginPerson) == parseInt(donator[i])) {
              // console.log("맞다");
              setIsDonator(true);
              break;
            }
          }
        }

        sessionStorage.setItem("isDonator", isDonator);
      })
      .catch((err) => console.log(err));

    axios
      .get("/token/amount", { params: { tokenNum: fundingNum } })
      .then((res) => {
        console.log("보유 토큰 : ", res.data);
        sessionStorage.setItem("currentTokenAmount", res.data);
      });
  }, [donator.length, achieveRate, isDonator]);

  //대표이미지 출력
  let fundingFileImage = null;
  if (thumbNail.size === 0) {
    fundingFileImage = (
      <Image
        style={{
          width: "100%",
          height: 420,
          "object-fit": "cover",
          marginTop: "30px",
        }}
        src="asset/img1.jpg"
      />
    );
  } else {
    fundingFileImage = Object.values(thumbNail).map((thumbImage) => (
      <Image
        style={{
          width: "100%",
          height: 435,
          "object-fit": "cover",
          marginTop: "30px",
        }}
        src={thumbImage.imageRoute}
        alt="사진없음"
      />
    ));
  }

  //펀딩 후원자 수 출력
  const donatorAmount = donator.length;

  const openModal = () => {
    if (loginPerson !== null) {
      setModalOpen(true);
    } else {
      Swal.fire({
        icon: "error",
        iconColor: "#ff6666",
        title: "로그인이 필요합니다.",
        showConfirmButton: true,
        confirmButtonColor: "#ff6666",
      });
      nav("/login");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <Header as="h1" style={{ marginTop: "60px", marginBottom: "30px" }}>
        {fundData.title}
      </Header>
      <Grid centered doubling columns={2}>
        <Grid.Column>{fundingFileImage}</Grid.Column>

        <Grid.Column
          style={{
            display: "flex",
            "flex-direction": "column",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Container style={{ height: 10 }}></Container>

          <Segment vertical style={{ border: "none", marginLeft: "25px" }}>
            <div className="subTitle" style={{ fontSize: "17px" }}>
              모인 금액
            </div>
            <Header
              style={{
                "white-space": "nowrap",
                overflow: "hidden",
                "text-overflow": "ellipsis",
                marginTop: "12px",
                fontSize: "27px",
              }}
            >
              <div className="aimAmount" style={{ display: "inline-block" }}>
                <div
                  className="currentAmt"
                  style={{ display: "inline", marginRight: "38px" }}
                >
                  {currentAmtFormat}원
                </div>
                <div style={{ width: "13vw", display: "inline-block" }}>
                  <ProgressBar completed={completeRate} />
                </div>
              </div>
            </Header>
          </Segment>

          <Segment vertical style={{ border: "none", marginLeft: "25px" }}>
            <div className="subTitle" style={{ fontSize: "17px" }}>
              남은 시간
            </div>
            <Header
              id="diffDayCount"
              style={{
                "white-space": "nowrap",
                overflow: "hidden",
                "text-overflow": "ellipsis",
                marginTop: "12px",
                fontSize: "27px",
              }}
            >
              {diffDay}
            </Header>
          </Segment>
          <Segment vertical style={{ border: "none", marginLeft: "25px" }}>
            <div className="subTitle" style={{ fontSize: "17px" }}>
              후원자
            </div>
            <Header
              style={{
                "white-space": "nowrap",
                overflow: "hidden",
                "text-overflow": "ellipsis",
                marginTop: "12px",
                fontSize: "27px",
              }}
            >
              {donatorAmount}명
            </Header>
          </Segment>

          <Segment vertical style={{ border: "none", marginLeft: "15px" }}>
            <div
              className="fundInfo"
              style={{
                border: "1px solid rgb(245, 245, 245)",
                fontSize: "14px",
                padding: "25px",
                paddingLeft: "40px",
                backgroundColor: "rgb(245, 245, 245)",
              }}
            >
              <div>
                <div
                  className="targetAmtArea"
                  style={{ display: "inline-block", height: "26px" }}
                >
                  <div
                    className="targetAmt"
                    style={{
                      display: "inline",
                      fontWeight: "700",
                      marginRight: "22px",
                    }}
                  >
                    목표 금액
                  </div>
                  <div className="targetData" style={{ display: "inline" }}>
                    {targetAmtFormat}원
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="fundPeriodArea"
                  style={{ display: "inline-block", marginBottom: "5px" }}
                >
                  <div
                    className="fundPeriod"
                    style={{
                      display: "inline",
                      fontWeight: "700",
                      marginRight: "22px",
                    }}
                  >
                    펀딩 기간
                  </div>
                  <div
                    className="fundPeriodData"
                    style={{ display: "inline", marginRight: "12px" }}
                  >
                    {dateFormat(fundData.startDate)} ~{" "}
                    {dateFormat(fundData.endDate)}
                  </div>
                  <div
                    className="fundPeriodDDay"
                    style={{
                      display: "inline",
                      backgroundColor: "#dcdcdc",
                      color: "#00b2b2",
                      fontSize: "12px",
                      fontWeight: "600",
                      borderRadius: "2px",
                    }}
                  >
                    {diffDay2}
                  </div>
                </div>
              </div>

              <div
                className="tokenInfo"
                style={{ display: "inline-block", marginBottom: "5px" }}
              >
                <div
                  className="tokenInfoData"
                  style={{
                    display: "inline",
                    fontWeight: "700",
                    marginRight: "22px",
                  }}
                >
                  토큰 가격
                </div>
                <div
                  className="tokenData"
                  style={{
                    display: "inline",
                    fontWeight: "bold",
                    color: "#00b2b2",
                  }}
                >
                  {fundToken.listingPrice}P
                </div>
                <div style={{ display: "inline" }}>당 1개의 </div>
                <div
                  style={{
                    display: "inline",
                    fontWeight: "bold",
                    color: "#00b2b2",
                  }}
                >
                  {fundToken.name} 토큰{" "}
                </div>
                <div style={{ display: "inline" }}>발행</div>
              </div>

              <div
                className="payAccountArea"
                style={{ display: "inline-block" }}
              >
                <div
                  className="payAccount"
                  style={{
                    display: "inline",
                    fontWeight: "700",
                    marginRight: "22px",
                  }}
                >
                  토큰 거래
                </div>
                <div className="payAccountData" style={{ display: "inline" }}>
                  목표금액 달성 시 토큰 거래가 진행됩니다.
                </div>
              </div>
            </div>
          </Segment>

          <Segment vertical>
            <FundingModal
              open={modalOpen}
              close={closeModal}
              header="펀딩 후원"
              fundingTitle={fundData.title}
              loginPerson={loginPerson}
              fundingNum={fundData.fundingNum}
            ></FundingModal>
            <Button id="fundingBtn"
              fluid
              style={{ marginLeft: "10px", width: "100%" }}
              onClick={openModal}
              disabled={(fundData.status === "종료")}
            >
              후원하기
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
      <Container style={{ height: 10 }}></Container>

      <TabMenu style={{ marginBottom: "50px" }} isDonator={isDonator}></TabMenu>
    </Container>
  );
};

export default FundingDetail;
