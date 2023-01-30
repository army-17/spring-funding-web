import React, { useCallback, useState } from "react";
import { Modal, Form, Container, Divider } from "semantic-ui-react";

const GoodsAddModal = (props) => {
  const [open, setOpen] = useState(true);

  const [data, setData] = useState({
    fundingNum: { fundingNum: localStorage.getItem("fundingNum") },
    title: "",
    price: "",
    desc1: "",
    desc2: "",
    desc3: "",
    imageFileName: "",
  });
  const onChange = useCallback(
    (e) => {
      const dataObj = {
        ...data,
        [e.target.name]: e.target.value,
      };
      setData(dataObj);
    },
    [data]
  );

  const [file, setFile] = useState({});
  const onFileChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files.length > 0) setFile(files[0]);
    },
    [file]
  );

  const cancel = () => {
    setOpen(false);
    props.toggleOpen();
  };

  const add = () => {
    // 파일 form 생성
    let form = new FormData();
    form.append("files", file);
    props.addGoods(data, form, cancel);
  };

  return (
    <Container>
      <Modal
        style={{}}
        onClose={() => {
          setOpen(false);
          props.toggleOpen();
        }}
        onOpen={() => setOpen(true)}
        open={open}
        size={"tiny"}
      >
        <Modal.Header>굿즈 추가</Modal.Header>
        <Modal.Content>
          <Container onSubmit={add}>
            <Form>
              <Form.Input
                name="title"
                label={"굿즈 이름"}
                placeholder={"굿즈 이름"}
                required={true}
                onChange={onChange}
              ></Form.Input>
              <Form.Input
                name="price"
                type="number"
                label={"판매 토큰"}
                placeholder={"판매 토큰"}
                required={true}
                onChange={onChange}
              ></Form.Input>
              <Form.Input
                name="desc1"
                label={"설명"}
                placeholder={"설명"}
                required={true}
                onChange={onChange}
              ></Form.Input>
              <Form.Input
                name="image"
                type="file"
                label={"이미지 파일 첨부"}
                required={true}
                onChange={onFileChange}
              ></Form.Input>
              <Divider></Divider>
              <Form.Group style={{ float: "right" }}>
                <Form.Button
                  type="submit"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  onClick={() => {
                    cancel();
                  }}
                >
                  취소
                </Form.Button>
                <Form.Button
                  type="submit"
                  style={{
                    backgroundColor: "#00b2b2",
                    color: "white",
                  }}
                >
                  추가
                </Form.Button>
              </Form.Group>
            </Form>
          </Container>
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default GoodsAddModal;
