import axios from "axios";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import "./Join.scss";
import "../common/Input.scss";
import "../common/Button.scss";
import Swal from "sweetalert2";

const Join = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    id: "",
    pwd: "",
    nickname: "",
    name: "",
    phone: "",
    email: "",
  });
  const { id, pwd, nickname, name, phone, email } = form;

  //오류메시지 상태저장
  const [validMessage, setValidMessage] = useState("");
  const [idMessage, setIdMessage] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [nickMessage, setNickMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [nRegMessage, setnRegMessage] = useState("");
  const [nValidMessage, setnValidMessage] = useState("");

  // 유효성 검사
  const [isId, setIsId] = useState(false);
  const [isReg, setIsReg] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isName, setIsName] = useState(false);
  const [isNick, setIsNick] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [nIsReg, setnIsReg] = useState(false);

  // const [isPasswordConfirm, setIsPasswordConfirm] = useState(false)

  const getValidId = () => {
    return isId && isReg ? true : false;
  };

  const getValidNick = () => {
    return isNick && nIsReg ? true : false;
  };

  const ocId = useCallback(
    async (e) => {
      const idRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{5,10}$/;
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      if (!idRegex.test(e.target.value)) {
        setRegMessage("아이디 형식을 확인해주세요.(5~10자 영문,숫자 조합)");
        setIsReg(false);
      } else {
        setIsReg(true);
        axios.get(`/member/checkId?id=${e.target.value}`).then((result) => {
          if (result.data === 0) {
            setValidMessage("사용가능한 아이디 입니다.");
            setIsId(true);
          } else {
            setIdMessage("이미 있는 회원입니다.");
            setIsId(false);
          }
        });
      }
      setForm(formObj);
    },
    [form]
  );

  const sendJoin = (e) => {
    e.preventDefault();
    axios
      .post("/member/join", form)
      .then((result) => {
        if (result.data === true) {
          Swal.fire({
            icon: "success",
            iconColor: "#00b6b6",
            title: "회원가입에 성공했습니다.",
            confirmButtonColor: "#00b2b2",
          });
          nav("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  const ocPwd = useCallback(
    (e) => {
      const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      if (!pwdRegex.test(e.target.value)) {
        setPwdMessage(
          "비밀번호를 확인해주세요. (8자리 이상/숫자+영문+특수문자)"
        );
        setIsPwd(false);
      } else {
        setPwdMessage("사용가능한 비밀번호 입니다.");
        setIsPwd(true);
      }
      setForm(formObj);
    },
    [form]
  );

  const ocName = useCallback(
    (e) => {
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      if (e.target.value.length < 2 || e.target.value.length > 5) {
        setNameMessage("2글자 이상 5글자 이하로 입력해주세요.");
        setIsName(false);
      } else {
        setNameMessage("올바른 이름 형식입니다.");
        setIsName(true);
      }
      setForm(formObj);
    },
    [form]
  );

  const ocNick = useCallback(
    (e) => {
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      console.log(e.target.value);
      if (e.target.value.length < 2 || e.target.value.length > 4) {
        setnRegMessage("2글자 이상 4글자 이하로 입력해주세요.");
        setnIsReg(false);
      } else {
        setnRegMessage("올바른 형식입니다.");
        setnIsReg(true);
        axios
          .get(`/member/checkNickname?nickname=${e.target.value}`)
          .then((result) => {
            if (result.data === 0) {
              setnValidMessage("사용가능한 닉네임입니다.");
              setIsNick(true);
            } else {
              setNickMessage("사용 중인 닉네임입니다.");
              setIsNick(false);
            }
          });
      }
      setForm(formObj);
    },
    [form]
  );

  const onPhone = useCallback(
    (e) => {
      const phoneRegex = /^[0-9]+$/;
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      if (!phoneRegex.test(e.target.value)) {
        setPhoneMessage("숫자만 입력해주세요");
        setIsPhone(false);
      } else {
        setPhoneMessage("사용가능합니다.");
        setIsPhone(true);
      }
      setForm(formObj);
    },
    [form]
  );

  const ocEmail = useCallback(
    (e) => {
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      if (!emailRegex.test(e.target.value)) {
        setEmailMessage("이메일 형식을 확인해주세요.");
        setIsEmail(false);
      } else {
        setEmailMessage("올바른 이메일 형식입니다.");
        setIsEmail(true);
      }
      setForm(formObj);
    },
    [form]
  );

  return (
    <div className="Join">
      <form className="JoinContent" onSubmit={sendJoin}>
        <h2>회원가입</h2>

        <input
          className="Input"
          name="id"
          value={id}
          placeholder="*아이디(5~10자 영문,숫자 조합)"
          onInput={ocId}
          autoFocus
          required
        />
        {id.length > 0 && !isId && (
          <span className={`message error`}>{idMessage}</span>
        )}
        {id.length > 0 && !isReg && (
          <span className={`message error`}>{regMessage}</span>
        )}
        {id.length > 0 && getValidId() && (
          <span className={`message success`}>{validMessage}</span>
        )}

        {/* <Button outline onClick={checkId}>중복 확인</Button> */}

        <input
          type="password"
          className="Input"
          name="pwd"
          value={pwd}
          placeholder="*비밀번호"
          onChange={ocPwd}
          required
        />
        {pwd.length > 0 && (
          <span className={`message ${isPwd ? "success" : "error"}`}>
            {pwdMessage}
          </span>
        )}

        <input
          className="Input"
          name="nickname"
          value={nickname}
          placeholder="*닉네임"
          onChange={ocNick}
          required
        />
        {nickname.length > 0 && !isNick && (
          <span className={`message error`}>{nickMessage}</span>
        )}
        {nickname.length > 0 && !nIsReg && (
          <span className={`message error`}>{nRegMessage}</span>
        )}
        {nickname.length > 0 && getValidNick() && (
          <span className={`message success`}>{nValidMessage}</span>
        )}

        <input
          className="Input"
          name="name"
          value={name}
          placeholder="*이름"
          onChange={ocName}
          required
        />
        {name.length > 0 && (
          <span className={`message ${isName ? "success" : "error"}`}>
            {nameMessage}
          </span>
        )}

        <input
          className="Input"
          name="phone"
          value={phone}
          placeholder="연락처"
          onChange={onPhone}
        />
        {phone.length > 0 && (
          <span className={`message ${isPhone ? "success" : "error"}`}>
            {phoneMessage}
          </span>
        )}

        <input
          className="Input"
          name="email"
          value={email}
          placeholder="이메일"
          onChange={ocEmail}
        />
        {email.length > 0 && (
          <span className={`message ${isEmail ? "success" : "error"}`}>
            {emailMessage}
          </span>
        )}

        {/* 필수조건이 다 맞다면 초록버튼으로 */}
        <Button type="submit" disabled={!(isId && isPwd && isNick && isName)}>
          가입
        </Button>
        {/* <Button type="submit">가입</Button> */}
      </form>
    </div>
  );
};

export default Join;
