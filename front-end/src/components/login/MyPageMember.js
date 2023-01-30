import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Divider,
  Button,
  Message,
  Header,
} from "semantic-ui-react";
import Swal from "sweetalert2";

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

  // pwd 유효성 검사
  const pwdChange = (e) => {
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!pwdRegex.test(e.target.value)) {
      setPwdError(true);
    } else {
      setPwdError(false);
      setEditPwd(e.target.value);
    }
  };

  // name 유효성 검사
  const nameChange = (e) => {
    if (e.target.value.length < 2 || e.target.value.length > 5) {
      setNameError(true);
    } else {
      setNameError(false);
      setEditName(e.target.value);
    }
  };

  // nickname 유효성 검사
  const nicknameChange = (e) => {
    // console.log(e.target.value.length);
    if (e.target.value.length < 2 || e.target.value.length > 4) {
      setNicknameError(true);
    } else {
      setNicknameError(false);
      setEditNickname(e.target.value);
    }
  };

  // phone 유효성 검사
  const phoneChange = (e) => {
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(e.target.value)) {
      setPhoneError(true);
    } else if (e.target.value.length > 15) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
      setEditPhone(e.target.value);
    }
  };

  // email 유효성 검사
  const emailChange = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!emailRegex.test(e.target.value)) {
      setEmailError(true);
    } else {
      setEmailError(false);
      setEditEmail(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (pwdError) return;
    if (nameError) return;
    if (nicknameError) return;
    if (phoneError) return;
    if (emailError) return;

    // 내 정보 깊은 복사로 객체 생성
    const editData = JSON.parse(JSON.stringify(memberItem)); // 깊은 복사

    // 각 속성 editValue 할당
    if (editPwd) editData.pwd = editPwd;
    if (editName) editData.name = editName;
    if (editNickname) editData.nickname = editNickname;
    if (editPhone) editData.phone = editPhone;
    if (editEmail) editData.email = editEmail;

    // editData axios 로 put 사용하여 서버 전달
    axios
      .put("/member/update", editData, { params: { memberNum: memberNum } })
      .then((res) => {
        if (res.data === true) {
          Swal.fire({
            icon: "success",
            iconColor: "#00b6b6",
            title: "수정되었습니다.",
            showConfirmButton: true,
            confirmButtonColor: "#00b2b2",
          });
          // window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "수정에 실패했습니다",
            iconColor: "#ff6666",
            showConfirmButton: true,
            confirmButtonColor: "#ff6666",
          });
        }
      })
      .catch((err) => console.log(err));

    // 객체의 깊은 복사, 얕은 복사 확인하는 방법
    // console.log("editData :>> ", editData);
    // console.log("memberItem :>> ", memberItem);
  };

  // pwd button
  const onUpdatePwd = () => {
    document.getElementById("updatePwd").style.display = "block";
    document.getElementById("updatePwdButton").style.display = "none";
    document.getElementById("cancelPwdButton").style.display = "block";
  };
  const onCancelPwd = () => {
    document.getElementById("cancelPwdButton").style.display = "none";
    document.getElementById("updatePwdButton").style.display = "block";
    document.getElementById("updatePwd").style.display = "none";
  };

  // name button
  const onUpdateName = () => {
    document.getElementById("updateName").style.display = "block";
    document.getElementById("updateNameButton").style.display = "none";
    document.getElementById("cancelNameButton").style.display = "block";
  };
  const onCancelName = () => {
    document.getElementById("cancelNameButton").style.display = "none";
    document.getElementById("updateNameButton").style.display = "block";
    document.getElementById("updateName").style.display = "none";
  };

  // nickname button
  const onUpdateNickname = () => {
    document.getElementById("updateNickname").style.display = "block";
    document.getElementById("updateNicknameButton").style.display = "none";
    document.getElementById("cancelNicknameButton").style.display = "block";
  };
  const onCancelNickname = () => {
    document.getElementById("cancelNicknameButton").style.display = "none";
    document.getElementById("updateNicknameButton").style.display = "block";
    document.getElementById("updateNickname").style.display = "none";
  };

  // phone button
  const onUpdatePhone = () => {
    document.getElementById("updatePhone").style.display = "block";
    document.getElementById("updatePhoneButton").style.display = "none";
    document.getElementById("cancelPhoneButton").style.display = "block";
  };
  const onCancelPhone = () => {
    document.getElementById("cancelPhoneButton").style.display = "none";
    document.getElementById("updatePhoneButton").style.display = "block";
    document.getElementById("updatePhone").style.display = "none";
  };

  // email button
  const onUpdateEmail = () => {
    document.getElementById("updateEmail").style.display = "block";
    document.getElementById("updateEmailButton").style.display = "none";
    document.getElementById("cancelEmailButton").style.display = "block";
  };
  const onCancelEmail = () => {
    document.getElementById("cancelEmailButton").style.display = "none";
    document.getElementById("updateEmailButton").style.display = "block";
    document.getElementById("updateEmail").style.display = "none";
  };

  return (
    <Container>
      {/* id form */}
      <Form>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Input label="ID" defaultValue={memberItem.id} readOnly={true} />
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
          <Button
            id="updatePwdButton"
            size="tiny"
            onClick={onUpdatePwd}
            style={{
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
            }}
          >
            수정
          </Button>
          <Button
            id="cancelPwdButton"
            size="tiny"
            onClick={onCancelPwd}
            style={{
              display: "none",
              border: "1px solid #ff6666",
              backgroundColor: "#ffffff",
              color: "#ff6666",
            }}
          >
            취소
          </Button>
        </Container>
      </Form>
      {/* pwd edit form  */}
      <Form error={pwdError} id="updatePwd" style={{ display: "none" }}>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Input
            label="새 비밀번호"
            type="password"
            name="pwd"
            defaultValue={editPwd}
            onChange={pwdChange}
          />
        </Container>
        {/* pwd error */}
        <Message
          error
          header="형식 제한"
          content="8자리 이상/숫자+영문+특수문자 조합으로 입력해주세요."
        />
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
          <Button
            id="updateNameButton"
            size="tiny"
            onClick={onUpdateName}
            style={{
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
            }}
          >
            수정
          </Button>
          <Button
            id="cancelNameButton"
            size="tiny"
            onClick={onCancelName}
            style={{
              display: "none",
              border: "1px solid #ff6666",
              backgroundColor: "#ffffff",
              color: "#ff6666",
            }}
          >
            취소
          </Button>
        </Container>
      </Form>
      {/* name edit form  */}
      <Form error={nameError} id="updateName" style={{ display: "none" }}>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Input
            label="변경할 이름"
            name="name"
            defaultValue={editName}
            onChange={nameChange}
          />
        </Container>
        {/* name error */}
        <Message
          error
          header="형식 제한"
          content="2글자 이상 5글자 이하로 입력해주세요."
        />
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
          <Button
            id="updateNicknameButton"
            size="tiny"
            onClick={onUpdateNickname}
            style={{
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
            }}
          >
            수정
          </Button>
          <Button
            id="cancelNicknameButton"
            size="tiny"
            onClick={onCancelNickname}
            style={{
              display: "none",
              border: "1px solid #ff6666",
              backgroundColor: "#ffffff",
              color: "#ff6666",
            }}
          >
            취소
          </Button>
        </Container>
      </Form>
      {/* nickname edit form  */}
      <Form
        error={nicknameError}
        id="updateNickname"
        style={{ display: "none" }}
      >
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Input
            label="새 닉네임"
            name="nickname"
            defaultValue={editNickname}
            onChange={nicknameChange}
          />
        </Container>
        {/* nickname error */}
        <Message
          error
          header="형식 제한"
          content="2글자 이상 4글자 이하로 입력해주세요."
        />
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
          <Button
            id="updatePhoneButton"
            size="tiny"
            onClick={onUpdatePhone}
            style={{
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
            }}
          >
            수정
          </Button>
          <Button
            id="cancelPhoneButton"
            size="tiny"
            onClick={onCancelPhone}
            style={{
              display: "none",
              border: "1px solid #ff6666",
              backgroundColor: "#ffffff",
              color: "#ff6666",
            }}
          >
            취소
          </Button>
        </Container>
      </Form>
      {/* phone edit form  */}
      <Form error={phoneError} id="updatePhone" style={{ display: "none" }}>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Input
            label="새 연락처"
            name="phone"
            defaultValue={editPhone}
            onChange={phoneChange}
          />
        </Container>
        {/* phone error */}
        <Message
          error
          header="형식 제한"
          content="15자 이하, 숫자만 입력해주세요."
        />
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
          <Button
            id="updateEmailButton"
            size="tiny"
            onClick={onUpdateEmail}
            style={{
              border: "1px solid #00b2b2",
              backgroundColor: "#ffffff",
              color: "#00b2b2",
            }}
          >
            수정
          </Button>
          <Button
            id="cancelEmailButton"
            size="tiny"
            onClick={onCancelEmail}
            style={{
              display: "none",
              border: "1px solid #ff6666",
              backgroundColor: "#ffffff",
              color: "#ff6666",
            }}
          >
            취소
          </Button>
        </Container>
      </Form>
      {/* email edit form  */}
      <Form error={emailError} id="updateEmail" style={{ display: "none" }}>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Form.Input
            label="새 이메일"
            name="email"
            defaultValue={editEmail}
            onChange={emailChange}
          />
        </Container>
        {/* email error */}
        <Message
          error
          header="형식 제한"
          content="이메일 형식을 확인해주세요."
        />
      </Form>
      <Container
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginTop: "60px",
        }}
      >
        <Button
          size="tiny"
          onClick={handleSubmit}
          style={{
            fontSize: "1rem",
            backgroundColor: "#00b2b2",
            color: "#ffffff",
            width: "150px",
            height: "40px",
            alignItems: "center",
            margin: "0px",
          }}
        >
          완료
        </Button>
      </Container>
    </Container>
  );
};

export default MyPageMember;
