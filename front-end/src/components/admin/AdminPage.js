import React from "react";
import { Container, Tab, Header } from "semantic-ui-react";
import AdminBoard from "./AdminBoard";
import AdminFunding from "./AdminFunding";
import AdminMember from "./AdminMember";


const AdminPage = () => {
  const panes = [
    {
      menuItem: "회원 관리",
      render: () => <Tab.Pane attached={false}>{<AdminMember />}</Tab.Pane>,
    },
    {
      menuItem: "펀딩 관리",
      render: () => <Tab.Pane attached={false}>{<AdminFunding />}</Tab.Pane>,
    },
    {
      menuItem: "게시글 관리",
      render: () => <Tab.Pane attached={false}>{<AdminBoard />}</Tab.Pane>,
    },
  ];

  const TabMenu = () => (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  );

  return (
    <Container textAlign="left">
      <Header as="h3">
        <div
          style={{
            backgroundColor: "#00b2b2",
            color: "#fff",
            marginTop: "7.5px",
            paddingLeft: "20px",
            height: "40px",
            lineHeight: "40px",
            textAlign: "left",
          }}
        >
          관리자 페이지
        </div>
      </Header>
      {TabMenu()}
    </Container>
  );
};

export default AdminPage;
