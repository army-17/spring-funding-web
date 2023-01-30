import React from "react";
import { Segment, Container } from "semantic-ui-react";
import "./Footer.scss";

const Footer = () => {
  if (window.location.pathname === "/login") return null;
  if (window.location.pathname === "/login/join") return null;
  return (
    <Segment
      style={{
        padding: 0,
        marginTop: 100,
        borderRadius: 0,
        borderTop: "1px solid rgb(220, 220, 220)",
      }}
    >
      <div>
        <Container
          style={{
            padding: "10px 0",
            display: "flex",
            flexWrap: "wrap",
            placeContent: "flex-start",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              width: "75%",
              marginRight: "auto",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div style={{ marginTop: "12px", width: "100%", height: "13px" }}>
              <div className="ft-info-div">
                <strong>프로젝트명</strong>
                <span>WadizIT</span>
              </div>
            </div>
            <div className="ft-info-div">
              <strong>신동</strong>
              <span>dong@naver.com</span>
            </div>
            <div className="ft-info-div">
              <strong>aram</strong>
              <span>chldkfka1@gmail.com</span>
            </div>
            <div className="ft-info-div">
              <strong>고구마</strong>
              <span>qq@naver.com</span>
            </div>
            <div className="ft-info-div">
              <strong>염아름</strong>
              <span>dongsu@naver.com</span>
            </div>
            <div className="ft-info-div">
              <strong>삼색이</strong>
              <span>samsaek@gmail.com</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div className="ft-link-div">
              <a>
                <img src="/asset/insta.png" />
              </a>
              <a>
                <img src="/asset/youtube.png" />
              </a>
              <a>
                <img src="/asset/twitter.png" />
              </a>
              <a>
                <img src="/asset/facebook.png" />
              </a>
              <a>
                <img src="/asset/naver.png" />
              </a>
              <a>
                <img src="/asset/kakao.png" />
              </a>
            </div>
          </div>
        </Container>
      </div>
      <div className="notice-div">
        <Container>
          <span>
            WadizIT은 플랫폼 제공자로서 프로젝트의 당사자가 아니며, 직접적인
            통신판매를 진행하지 않습니다. 거래와 프로젝트의 완수 및 선물제공의
            책임은 해당 프로젝트의 창작자에게 있으며, 프로젝트와 관련하여
            후원자와 발생하는 법적 분쟁에 대한 책임은 해당 창작자가 부담합니다.
          </span>
        </Container>
      </div>
    </Segment>
  );
};

export default Footer;
