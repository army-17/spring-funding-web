import React from "react";
import { Container, Segment, Grid, Header, Button } from "semantic-ui-react";

const TokenOpenOrderElement = (props) => {
  const cancelOrder = () => {
    props.cancelOrder(props.orderNum);
  };

  return (
    <Segment.Group
      basic="true"
      style={{
        flex: 1,
        margin: 0,
        padding: 0,
      }}
    >
      <Grid style={{ margin: 0, padding: 5 }}>
        <Grid.Row style={{ margin: 0, padding: 0 }} textAlign="center">
          <Grid.Column
            verticalAlign={"middle"}
            stretched
            style={{ margin: 0, padding: 0 }}
            width={5}
          >
            <Header
              as={"h4"}
              textAlign={"left"}
              style={{
                margin: 0,
                marginLeft: 5,
                padding: 0,
                color: props.color,
              }}
            >
              {/* 수량 */}
              {props.orderRemainAmount} 토큰
            </Header>
          </Grid.Column>
          <Grid.Column
            verticalAlign={"middle"}
            stretched
            style={{ margin: 0, padding: 0 }}
            width={9}
          >
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Header
                as={"h4"}
                textAlign={"right"}
                style={{
                  flex: 1,
                  margin: 0,
                  padding: 0,
                  marginRight: 5,
                  color: props.color,
                }}
              >
                {/* 주문 가격 */}
                {props.orderPrice} 포인트
              </Header>
            </Container>
          </Grid.Column>

          <Grid.Column
            verticalAlign={"middle"}
            stretched
            style={{ margin: 0, padding: 0 }}
            width={2}
          >
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Button
                basic={true}
                style={{ padding: 0, margin: 0 }}
                onClick={cancelOrder}
                icon="cancel"
              ></Button>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment.Group>
  );
};

export default TokenOpenOrderElement;
