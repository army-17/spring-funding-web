import React from "react";
import { Container, Tab, Header } from "semantic-ui-react";
import MyPageDonate from "./MyPageDonate";
import MyPageFunding from "./MyPageFunding";
import MyPageMember from "./MyPageMember";
import MyPagePay from "./MyPagePay";

const MyPage = () => {
  const panes = [
    {
      menuItem: "회원 정보",
      render: () => <Tab.Pane attached={false}>{<MyPageMember />}</Tab.Pane>,
    },
    {
      menuItem: "펀딩 생성 내역",
      render: () => <Tab.Pane attached={false}>{<MyPageFunding />}</Tab.Pane>,
    },
    {
      menuItem: "후원 내역",
      render: () => <Tab.Pane attached={false}>{<MyPageDonate />}</Tab.Pane>,
    },
    {
      menuItem: "결제 내역",
      render: () => <Tab.Pane attached={false}>{<MyPagePay />}</Tab.Pane>,
    },
  ];

  const TabMenu = () => (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  );

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
        마이페이지
      </Header>
      {TabMenu()}
    </Container>
  );
};

export default MyPage;
