import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Form, Divider, Header } from "semantic-ui-react";

const MyPageMember = () => {
  // 데이터
  const [memberItem, setMemberItem] = useState([]);

  // 유효성 검사
  const [pwdError, setPwdError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // 수정 관련
  const [editPwd, setEditPwd] = useState("");
  const [editName, setEditName] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const memberNum = sessionStorage.getItem("memberNum");

  useEffect(() => {
    // 내 정보 가져오기
    axios
      .get(`/member/get?MemberNum=${memberNum}`)
      .then((res) => {
        setMemberItem(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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
        내 정보
      </Header>
      {/* id form */}
      <Container
        style={{ border: "1px solid rgba(34,36,38,.15)", padding: "2vw" }}
      >
        <Form>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Input
              label="ID"
              defaultValue={memberItem.id}
              readOnly={true}
            />
          </Container>
        </Form>
        <Divider></Divider>

        {/* -------------------- pwd form */}
        <Form>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Input
              label="비밀번호"
              type="password"
              defaultValue={memberItem.pwd}
              readOnly={true}
            />
          </Container>
        </Form>
        <Divider></Divider>

        {/* -------------------- name form */}
        <Form>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Input
              label="이름"
              defaultValue={memberItem.name}
              readOnly={true}
            />
          </Container>
        </Form>

        <Divider></Divider>

        {/* -------------------- nickname form */}
        <Form>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Input
              label="닉네임"
              defaultValue={memberItem.nickname}
              readOnly={true}
            />
          </Container>
        </Form>

        <Divider></Divider>

        {/* -------------------- phone form */}
        <Form>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Input
              label="연락처"
              defaultValue={memberItem.phone}
              readOnly={true}
            />
          </Container>
        </Form>

        <Divider></Divider>

        {/* -------------------- email form */}
        <Form>
          <Container
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Form.Input
              label="이메일"
              defaultValue={memberItem.email}
              readOnly={true}
            />
          </Container>
        </Form>
      </Container>
    </Container>
  );
};

export default MyPageMember;
