/** @format */

import React, { useState } from "react";
import { Container, Form, Segment, Header } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../common/Swal.scss";

const FundingTerms = () => {
  const terms_1 = `1. 이용 목적
Wadiz-IT 서비스 및 제품(이하 ‘서비스’)을 이용해 주셔서 감사합니다. 본 약관은 다양한 Wadiz-IT 서비스의 이용과 관련하여 Wadiz-IT 서비스를 제공하는 Wadiz-IT 주식회사(이하 ‘Wadiz-IT’)와 이를 이용하는 Wadiz-IT 서비스 회원(이하 ‘회원’) 또는 비회원과의 관계를 설명하며, 아울러 여러분의 Wadiz-IT 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다. Wadiz-IT 펀딩 서비스를 이용하실 경우 여러분은 본 약관 및 관련 운영 정책을 확인하거나 동의하게 되므로, 잠시 시간을 내시어 주의 깊게 살펴봐 주시기 바랍니다.`;

  const terms_2 = `2. 이용 규칙
  1) 프로젝트로 소개할 제품이나 서비스는 프로젝트가 진행될 때부터 발생이 끝날 때까지 다른 온.오프라인에서 펀딩을 하거나 유통하실 수 없습니다.
  2) 작성한 프로젝트나 제작한 제품/서비스가 제 3자의 지식재산권을 침해하지 않아야 합니다.
  3) 서포터님들께 프로젝트의 진행 과정을 안내할 의무가 있습니다. 또 사전에 안내할 발송 일정과 방식 등을 지켜주시길 바랍니다.
  4) 서포터님들과의 신뢰를 위해 프로젝트 진행이나 제품/서비스의 제작/발송 등 모든 과정을 차질없이 진행하여 주시길 바랍니다.
  5) 프로젝트로 소개할 제품/서비스의 관계 법령과 광고 심의 규정을 준수해서 스토리를 작성하여 주시길 바랍니다.
  6) 펀딩을 통한 모금액은 발행 토큰의 개수와 가격에 비례하며, 최종 모금액은 목표금액을 초과할 수 있습니다. (토큰 발행량 또한 증가함.)
  7) 서포터님들은 모금을 통해 토큰을 지급받으며, 참여하신 펀딩의 모금 종료와 동시에 토큰거래를 진행하실 수 있습니다.
  8) 토큰의 가격은 서포터님들의 거래를 통해 유동적으로 변할 수 있습니다.`;
  const [checkedButtons, setCheckedButtons] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedButtons([...checkedButtons, id]);
      //console.log("체크 반영 완료");
    } else {
      setCheckedButtons(checkedButtons.filter((button) => button !== id));
      //console.log("체크 해제 반영 완료");
    }
  };
  const nav = useNavigate();
  const moveFundingForm = () => {
    Swal.fire({
      title: "모든 약관에 동의하셨습니다.",
      text: "펀딩 작성 페이지로 이동하시겠습니까?",
      icon: "question",
      iconColor: "#00b2b2",
      showCancelButton: true,
      confirmButtonText: "네 바로 이동할게요",
      confirmButtonColor: "#00b2b2",
      cancelButtonText: "아니오 한번 더 확인할게요",
      cancelButtonColor: "#ff6666",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "이동!",
          "펀딩 작성을 진행해주세요",
          "success",
          nav("/funding/form")
        );
      }
    });
  };

  const isAllChecked = checkedButtons.length === 2;
  const disabled = !isAllChecked;
  return (
    <Container textAlign="left">
      <Header
        style={{
          backgroundColor: "#00b2b2",
          color: "#ffffff",
          marginTop: "7.5px",
          paddingLeft: "20px",
          height: "40px",
          lineHeight: "40px",
          textAlign: "left",
        }}
        as="h3"
      >
        펀딩 약관
      </Header>
      <Segment style={{ padding: "30px" }}>
        <Form>
          <Form.Group widths="equal">
            <Form.TextArea
              style={{
                height: 200,
                lineHeight: "2.2rem",
                resize: "none",
                paddingLeft: "30px",
                paddingRight: "30px",
                backgroundColor: "rgb(245, 245, 245)",
                border: "rgb(245, 245, 245)",
              }}
              fluid="true"
              label="개인정보 수집 및 이용 동의"
              required={true}
              value={terms_1}
              readOnly
            />
          </Form.Group>
          <input
            type="checkbox"
            id="check"
            onChange={(e) => {
              changeHandler(e.currentTarget.checked, "check");
            }}
            checked={checkedButtons.includes("check") ? true : false}
          ></input>
          <div style={{ display: "inline-block", marginBottom: "20px" }}>
            <label
              id="check"
              htmlFor="check"
              style={{ display: "inline", marginRight: "5px" }}
            ></label>
            <p style={{ display: "inline" }}>동의</p>
          </div>

          <Form.Group widths="equal">
            <Form.TextArea
              style={{
                height: 200,
                resize: "none",
                lineHeight: "2.2rem",
                paddingLeft: "30px",
                paddingRight: "35px",
                backgroundColor: "rgb(245, 245, 245)",
                border: "rgb(245, 245, 245)",
              }}
              fluid="true"
              label="개인정보 수집 및 이용 동의"
              required={true}
              value={terms_2}
              readOnly
            />
          </Form.Group>
          <input
            type="checkbox"
            id="check2"
            onChange={(e) => {
              changeHandler(e.currentTarget.checked, "check2");
            }}
            checked={checkedButtons.includes("check2") ? true : false}
          ></input>
          <div style={{ display: "inline-block" }}>
            <label
              id="check2"
              htmlFor="check2"
              style={{ display: "inline", marginRight: "5px" }}
            ></label>
            <span style={{ display: "inline" }}>동의</span>
          </div>
        </Form>
      </Segment>
      <Container textAlign="center">
        <Form.Button
          type="submit"
          disabled={disabled}
          onClick={moveFundingForm}
          style={
            disabled
              ? { backgroundColor: "#859594" }
              : { backgroundColor: "#00b2b2", color: "white" }
          }
        >
          제출
        </Form.Button>
      </Container>
    </Container>
  );
};

export default FundingTerms;
