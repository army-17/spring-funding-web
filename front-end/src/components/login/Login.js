import axios from "axios";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "../common/Button";
import KakaoButton from "./KakaoButton";
import "./Login.scss";

const Login = ({ sucLogin }) => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    id: "",
    pwd: "",
  });
  const { id, pwd } = form;

  const sendLogin = (e) => {
    e.preventDefault();

    axios
      .post("/member/login", form)
      .then((result) => {
        if (result.data.success === true) {
          sucLogin(result.data);
          nav("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "로그인 정보를 확인해주세요",
            iconColor: "#ff6666",
            confirmButtonColor: "#ff6666",
          });
        }
        const formObj = {
          id: "",
          pwd: "",
        };
        setForm(formObj);
      })
      .catch((err) => console.log(err));
  };

  const onChange = useCallback(
    (e) => {
      const formObj = {
        ...form,
        [e.target.name]: e.target.value,
      };
      setForm(formObj);
    },
    [form]
  );

  return (
    <div className="Login">
      <form className="Content" onSubmit={sendLogin}>
        <h2>로그인</h2>
        <input
          className="Input"
          name="id"
          value={id}
          placeholder="아이디"
          onChange={onChange}
          autoFocus
          required
        />
        <input
          type="password"
          className="Input"
          name="pwd"
          value={pwd}
          placeholder="비밀번호"
          onChange={onChange}
          required
        />
        <Button type="submit" disabled={!(id && pwd)}>
          로그인
        </Button>
      </form>
      <KakaoButton />
    </div>
  );
};

export default Login;
