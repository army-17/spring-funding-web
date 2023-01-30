import React from "react";
import { Card, Divider } from "semantic-ui-react";

const FundingReward = () => {
  return (
    <Card.Group centered stackable style={{ "margin-top": 0 }}>
      <Card>
        <Card.Content>
          <Card.Header as={"h2"}>500,000원</Card.Header>
          <Card.Meta>Ultimate Edition</Card.Meta>
          <Divider></Divider>
          <Card.Description as={"b"}>기본 게임 키 제공</Card.Description>
          <Card.Description>+ 디아블로 탈것</Card.Description>
          <Card.Description>+ 귀여운 디아블로 펫</Card.Description>
          <Card.Description>+ 티리엘 날개</Card.Description>
        </Card.Content>
        <Card.Content extra></Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Card.Header as={"h2"}>500,000원</Card.Header>
          <Card.Meta>Ultimate Edition</Card.Meta>
          <Divider></Divider>
          <Card.Description as={"b"}>기본 게임 키 제공</Card.Description>
          <Card.Description>+ 디아블로 탈것</Card.Description>
          <Card.Description>+ 귀여운 디아블로 펫</Card.Description>
          <Card.Description>+ 티리엘 날개</Card.Description>
        </Card.Content>
        <Card.Content extra></Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Card.Header as={"h2"}>500,000원</Card.Header>
          <Card.Meta>Ultimate Edition</Card.Meta>
          <Divider></Divider>
          <Card.Description as={"b"}>기본 게임 키 제공</Card.Description>
          <Card.Description>+ 디아블로 탈것</Card.Description>
          <Card.Description>+ 귀여운 디아블로 펫</Card.Description>
          <Card.Description>+ 티리엘 날개</Card.Description>
        </Card.Content>
        <Card.Content extra></Card.Content>
      </Card>
    </Card.Group>
  );
};

export default FundingReward;
