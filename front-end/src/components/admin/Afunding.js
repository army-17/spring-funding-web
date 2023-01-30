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
import FundingProjectIntro from "../funding/FundingProjectIntro";
import ProgressBar from "../common/ProgressBar";

const panes = [
  {
    menuItem: "프로젝트 소개",
    render: () => (
      <Tab.Pane attached={false}>{<FundingProjectIntro />}</Tab.Pane>
    ),
  },
];

const TabMenu = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
);

const dateFormat = (date) => moment(date).format("YYYY.MM.DD");

const Afunding = ({ fundingNum }) => {
  fundingNum = localStorage.getItem("fundingNum");
  const [fundData, setFundData] = useState({
    currentAmount: 0,
    targetAmount: 0,
    title: "",
    startDate: "",
    endDate: "",
  });

  //디데이 계산
  var today = new Date();
  var endDateFormat = new Date(fundData.endDate);
  var diff = endDateFormat - today;
  const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
  // console.log(diffDay);

  //달성률 %
  var achieveRate =
    (parseFloat(fundData.currentAmount) / parseFloat(fundData.targetAmount)) *
    100;
  // console.log("달성률 : " + achieveRate);

  //금액 쉼표 표시
  let currentAmtFormat = fundData.currentAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let targetAmtFormat = fundData.targetAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  //progress bar 애니메이션
  const [completeRate, setCompleteRate] = useState(0);

  const [thumbNail, setThumbNail] = useState([
    {
      imageRoute: "",
    },
  ]);

  //펀딩 상세정보 대표이미지 출력

  //펀딩 상세정보 출력
  useEffect(() => {
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

    axios
      .get("/funding", { params: { fundingNum: fundingNum } })
      .then((res) => {
        console.log(res.data);
        setFundData(res.data);
      })
      .catch((err) => console.log(err));

    setTimeout(() => setCompleteRate(achieveRate), 1000);
    console.log("달성률: " + achieveRate);
  }, [achieveRate]);

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
          height: 420,
          "object-fit": "cover",
          marginTop: "30px",
        }}
        src={thumbImage.imageRoute}
        alt="사진없음"
      />
    ));
  }

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
            marginTop: "30px",
          }}
        >
          <Container style={{ height: 10 }}></Container>

          <Segment vertical style={{ border: "none", marginLeft: "15px" }}>
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
                  style={{ display: "inline", marginRight: "20px" }}
                >
                  {currentAmtFormat}원
                </div>
                <ProgressBar completed={completeRate} />
                {/* <Pyrogress.Bar progress={achieveRate} width={200}/> */}
                {/* <progress className="achieveRate" style={{ display: "inline" }} value={achieveRate} max="100"></progress> */}
                {/* <div className="achieveRate" style={{display:"inline", fontSize:"15px" }}>{achieveRate}%</div> */}
              </div>
            </Header>
          </Segment>

          <Segment vertical style={{ border: "none", marginLeft: "15px" }}>
            <div className="subTitle" style={{ fontSize: "17px" }}>
              남은 시간
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
              {diffDay}일
            </Header>
          </Segment>
          <Segment vertical style={{ border: "none", marginLeft: "15px" }}>
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
              1,200명
            </Header>
          </Segment>

          <Segment vertical style={{ border: "none", marginLeft: "15px" }}>
            <div
              className="fundInfo"
              style={{
                border: "1px solid",
                fontSize: "14px",
                padding: "20px",
                paddingLeft: "30px",
              }}
            >
              <div>
                <div
                  className="targetAmtArea"
                  style={{ display: "inline-block", marginBottom: "5px" }}
                >
                  <div
                    className="targetAmt"
                    style={{
                      display: "inline",
                      fontWeight: "700",
                      marginRight: "18px",
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
                      marginRight: "18px",
                    }}
                  >
                    펀딩 기간
                  </div>
                  <div
                    className="fundPeriodData"
                    style={{ display: "inline", marginRight: "10px" }}
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
                    {diffDay}일 남음
                  </div>
                </div>
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
                    marginRight: "48px",
                  }}
                >
                  결제
                </div>
                <div className="payAccountData" style={{ display: "inline" }}>
                  목표금액 달성시 결제가 진행됩니다.
                </div>
              </div>
            </div>
          </Segment>

          <Segment vertical>
            {/* <Button fluid style={{marginLeft:"10px", width:"100%"}}>후원하기</Button> */}
          </Segment>
        </Grid.Column>
      </Grid>
      <Container style={{ height: 10 }}></Container>

      <TabMenu style={{ marginBottom: "50px" }}></TabMenu>
    </Container>
  );
};

export default Afunding;
