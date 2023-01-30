/** @format */

import React, { useCallback, useState } from "react";
import { Container, Form, Header, Divider, Input } from "semantic-ui-react";
import Calendar from "react-calendar";
import Modal from "../common/Modal";
import "../common/MyCalendar.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment/moment";
import Swal from "sweetalert2";

const FundingForm = () => {
  const [modalOpen1, setModalOpen1] = useState(false);
  const openModal1 = () => {
    setModalOpen1(true);
  };
  const closeModal1 = () => {
    setModalOpen1(false);
  };

  const nav = useNavigate();
  const memberNum = sessionStorage.getItem("memberNum");
  const [data, setData] = useState({
    title: "",
    membernum: { memberNum: memberNum },
    tokenName: "",
    tokenPrice: "",
    tokenAmount: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    category: 0,
    status: 0,
  });

  const [fileList, setFileList] = useState([]);
  const { title, tokenPrice, tokenAmount } = data;
  const targetAmount = tokenAmount * tokenPrice;
  // const { title, tamount } = data;
  // const tkprice = "";
  // const tkamount = "";
  //const tamount = String(tkprice * tkamount);
  // const [targetAmount, setTargetAmount] = useState();
  // useEffect(() => {
  //   console.log("useEffect", data);
  // }, [data]);

  const onWrite = useCallback(
    (e) => {
      e.preventDefault();
      // console.log(data);
      // formData.append(
      //   "data",
      //   new Blob([JSON.stringify(data)], { type: "application/json" })
      // );
      // console.log("senddata:", data);
      let form = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        form.append("files", fileList[i]);
      }
      const sendData = { ...data, targetAmount: targetAmount };
      console.log(sendData);

      axios
        // .post("funding", JSON.stringify(data), {
        //   headers: { "Content-Type": "application/json" },
        // })
        .post("/funding", sendData)
        .then((res) => {
          if (res.data !== 0) {
            axios.post("/token", {
              tokenNum: res.data,
              name: sendData.tokenName,
              amount: sendData.tokenAmount,
              currentPrice: sendData.tokenPrice,
              listingPrice: sendData.tokenPrice,
            });

            let keys = fileList.keys();
            let i = 0;
            for (const key of keys) {
              i++;
            }

            console.log(i, keys, fileList);

            if (i !== 0) {
              console.log("post funding file");
              axios
                .post(
                  "/funding/file",
                  form,
                  { params: { fundingNum: res.data } },
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  }
                )
                .then((res) => {
                  Swal.fire({
                    icon: "success",
                    iconColor: "#00b2b2",
                    title: "펀딩 생성이 완료되었습니다!",
                    text: "생성하신 펀딩은 내부심사를 거쳐 등록됩니다.",
                    showConfirmButton: true,
                    confirmButtonColor: "#00b2b2",
                    // timer: 3000,
                  });
                  // alert("작성 성공");
                  nav("/");
                });
            } else {
              Swal.fire({
                icon: "success",
                iconColor: "#00b2b2",
                title: "펀딩 생성이 완료되었습니다!",
                text: "생성하신 펀딩은 내부심사를 거쳐 등록됩니다.",
                showConfirmButton: true,
                confirmButtonColor: "#00b2b2",
              });
              // alert("작성 성공");
              nav("/");
            }
          } else {
            Swal.fire({
              icon: "error",
              iconColor: "#ff6666",
              title: "펀딩 생성이 실패하였습니다!",
              text: "관리자에게 문의해 주세요.",
              showConfirmButton: true,
              confirmButtonColor: "#ff6666",
            });
            //alert("게시글 등록 실패");
          }
        })
        .catch((error) => console.log(error));
    },
    [data, fileList, nav, targetAmount]
  );
  //const [targetAmount, setTargetAmount] = useState();
  const onChange = useCallback(
    (e) => {
      // const targetAmountFormat = tokenAmount * tokenPrice;
      // setTargetAmount(targetAmountFormat);

      const dataObj = {
        ...data,
        // targetAmount: targetAmountFormat,

        [e.target.name]: e.target.value,
      };
      // setTargetAmount(tkprice * tkamount);
      // console.log(e);
      // console.log("target name: ", e.target.name);
      // console.log(dataObj);
      setData(dataObj);
    },
    [data]
  );
  //console.log(data);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const onChangeDate = useCallback(
    (e) => {
      const startDateFormat = moment(e[0]).format("YYYY-MM-DD");
      const endDateFormat = moment(e[1]).format("YYYY-MM-DD");

      setStartDate(startDateFormat);
      setEndDate(endDateFormat);

      const dataObj = {
        ...data,
        startDate: startDateFormat,
        endDate: endDateFormat,
      };
      setData(dataObj);
    },
    [data]
  );

  const onFileChange = useCallback(
    (e) => {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        console.log("append", files[i]);

        setFileList((prev) => {
          return [...prev, files[i]];
        });
      }
      console.log(fileList);
    },
    [fileList]
  );

  return (
    <Container textAlign="left" onSubmit={onWrite}>
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
        펀딩 생성
      </Header>
      <Container style={{ padding: "1vw 1vw 2vw 1vw" }}>
        <Form>
          <Form.Input
            name="title"
            required={true}
            fluid
            label="제목"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={onChange}
          />
        </Form>
        <Divider></Divider>
        <Form>
          <Form.Input
            name="tokenName"
            required={true}
            fluid
            label="토큰 이름"
            placeholder="토큰 이름"
            value={data.tokenName}
            onChange={onChange}
          />
        </Form>
        <Divider></Divider>
        <Form>
          <Form.Input
            name="tokenPrice"
            required={true}
            fluid
            type="number"
            label="토큰 발행 가격"
            placeholder="토큰 발행 가격 (숫자, 단위=￦)"
            value={tokenPrice}
            onChange={onChange}
          />
        </Form>
        <Divider></Divider>
        <Form>
          <Form.Input
            name="tokenAmount"
            required={true}
            fluid
            type="number"
            label="토큰 발행 개수"
            placeholder="토큰 발행 개수 (숫자, 단위=개)"
            value={tokenAmount}
            onChange={onChange}
          />
        </Form>
        <Divider></Divider>
        <Form>
          <Form.Input
            name="targetAmount"
            required={true}
            fluid
            type="number"
            label="목표 금액"
            placeholder="목표 금액 (숫자, 단위=￦)"
            value={targetAmount}
            onChange={onChange}
          />
        </Form>
        <Divider></Divider>
        <Form>
          <Form.Group>
            <React.Fragment>
              <Modal
                open={modalOpen1}
                close={closeModal1}
                header="펀딩 기간 설정"
              >
                <Container textAlign="center">
                  <div className="calendar-container">
                    <Calendar
                      onChange={onChangeDate}
                      selectRange={true}
                      formatDay={(locale, date) => moment(date).format("DD")}
                    />
                  </div>
                </Container>
              </Modal>
            </React.Fragment>
            <Form.Field
              onClick={openModal1}
              required={true}
              label="펀딩 시작 날짜"
              control={Input}
              name="startDate"
              value={startDate || ""}
              type="text"
              // maxLength="4"
              width={3}
              placeholder="시작 날짜"
              onChange={onChangeDate}
            />
          </Form.Group>
          <Divider></Divider>
          <Form.Group>
            <Form.Field
              onClick={openModal1}
              required={true}
              label="펀딩 종료 날짜"
              control={Input}
              name="endDate"
              value={endDate || ""}
              type="text"
              // maxLength="4"
              width={3}
              placeholder="종료 날짜"
              onChange={onChangeDate}
            />
          </Form.Group>
        </Form>
        <Divider></Divider>
        <Form>
          <Form.Input
            type="file"
            required={true}
            fluid
            label="사업자 등록증 추가"
            name="files"
            onChange={onFileChange}
            //multiple
          />
          <Form.Input
            type="file"
            required={true}
            fluid
            label="펀딩 대표이미지 추가"
            name="files"
            accept="image/*"
            onChange={onFileChange}
            //multiple
          />
          <Form.Input
            type="file"
            required={true}
            fluid
            label="펀딩 상세정보 이미지 추가"
            name="files"
            accept="image/*"
            onChange={onFileChange}
            multiple
          />
          {/* <Form.Button
          style={{
            backgroundColor: "gray",
            color: "white",
            display: "inline-block",
            float: "right",
          }}
        >
          등록 취소
        </Form.Button> */}
          <Form.Button
            type="submit"
            style={{
              backgroundColor: "#00b2b2",
              color: "white",
              display: "inline-block",
              float: "right",
            }}
          >
            펀딩 등록
          </Form.Button>
        </Form>
      </Container>
    </Container>
  );
};

export default FundingForm;
