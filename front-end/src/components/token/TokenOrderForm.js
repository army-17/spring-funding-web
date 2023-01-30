import React, { useCallback, useState } from "react";
import {
  Container,
  Header,
  Card,
  Button,
  Icon,
  Input,
  Divider,
  Grid,
} from "semantic-ui-react";

const TokenBuyOrder = (props) => {
  const [buyAmount, setAmount] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);

  const onChangeAmount = useCallback((e) => {
    setAmount(e.target.value);
  }, []);

  const onChangePrice = useCallback((e) => {
    setBuyPrice(e.target.value);
  }, []);

  const sendBuyOrder = () => {
    props.sendBuyOrder(buyPrice, buyAmount);
    setBuyPrice(0);
    setAmount(0);
  };

  return (
    <Card fluid={true}>
      <Card.Content>
        <Card.Header>토큰 매수 주문</Card.Header>
        <Card.Description>
          <Container
            style={{
              display: "flex",
              verticalAlign: "middle",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Header style={{ margin: 0 }} size="small">
              매수 가능 금액
            </Header>
            <Header style={{ margin: 0, color: "#00b2b2" }} size="small">
              {props.availablePoint} 포인트
            </Header>
          </Container>
          <br></br>
          <Container>
            <Grid columns={2} style={{ margin: 0, padding: 0 }}>
              <Grid.Column style={{ margin: 0, padding: 0 }}>
                <Input
                  name="buyAmount"
                  value={buyAmount}
                  icon={<Icon name="shekel sign" inverted circular link />}
                  size="mini"
                  onChange={onChangeAmount}
                  fluid
                ></Input>
              </Grid.Column>
              <Grid.Column style={{ margin: 0, padding: 0 }}>
                <Input
                  name="buyPrice"
                  value={buyPrice}
                  icon={<Icon name="won sign" inverted circular link />}
                  size="mini"
                  onChange={onChangePrice}
                  fluid
                ></Input>
              </Grid.Column>
            </Grid>
          </Container>
          <Divider></Divider>
          <Button
            fluid
            style={{ backgroundColor: "#00b2b2", color: "white" }}
            onClick={sendBuyOrder}
          >
            매수
          </Button>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

const TokenSellOrder = (props) => {
  const [sellPrice, setSellPrice] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);

  const onChangePrice = useCallback((e) => {
    setSellPrice(e.target.value);
  }, []);

  const onChangeAmount = useCallback((e) => {
    setSellAmount(e.target.value);
  }, []);

  const sendSellOrder = () => {
    props.sendSellOrder(sellPrice, sellAmount);
    setSellPrice(0);
    setSellAmount(0);
  };

  return (
    <Card fluid={true}>
      <Card.Content>
        <Card.Header>토큰 매도 주문</Card.Header>
        <Card.Description>
          <Container
            style={{
              display: "flex",
              verticalAlign: "middle",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Header style={{ margin: 0 }} size="small">
              매도 가능 보유 토큰
            </Header>
            <Header color="red" style={{ margin: 0 }} size="small">
              {props.availableToken} 토큰
            </Header>
          </Container>
          <br></br>
          <Grid columns={2} style={{ margin: 0, padding: 0 }}>
            <Grid.Column style={{ margin: 0, padding: 0 }}>
              <Input
                name="sellAmount"
                value={sellAmount}
                icon={<Icon name="shekel sign" inverted circular link />}
                size="mini"
                onChange={onChangeAmount}
                fluid
              ></Input>
            </Grid.Column>
            <Grid.Column style={{ margin: 0, padding: 0 }}>
              <Input
                name="sellPrice"
                value={sellPrice}
                icon={<Icon name="won sign" inverted circular link />}
                size="mini"
                onChange={onChangePrice}
                fluid
              ></Input>
            </Grid.Column>
          </Grid>
          <Divider></Divider>
          <Button fluid color="red" onClick={sendSellOrder}>
            매도
          </Button>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

const TokenOrderForm = (props) => {
  return (
    <Card.Group doubling={true}>
      <TokenSellOrder
        sendSellOrder={props.sendSellOrder}
        availableToken={props.availableToken}
      ></TokenSellOrder>
      <TokenBuyOrder
        sendBuyOrder={props.sendBuyOrder}
        availablePoint={props.availablePoint}
      ></TokenBuyOrder>
    </Card.Group>
  );
};

export default TokenOrderForm;
