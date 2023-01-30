import React from "react";
import { Grid, Header, Segment } from "semantic-ui-react";

const TokenOrderBookElement = (props) => {
  return (
    <Segment.Group style={{ flex: 1, margin: 0 }}>
      <Grid style={{ margin: 0, padding: 4 }}>
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
              {/* 매수 주문 잔량 */}
              {props.buyVolume}
            </Header>
          </Grid.Column>
          <Grid.Column
            verticalAlign={"middle"}
            stretched
            style={{ margin: 0, padding: 0 }}
            width={6}
          >
            <Header
              as={"h4"}
              textAlign={"center"}
              style={{
                margin: 0,
                marginLeft: 5,
                padding: 0,
                color: props.color,
              }}
            >
              {/* 가격 */}
              {props.price}
            </Header>
          </Grid.Column>
          <Grid.Column
            verticalAlign={"middle"}
            stretched
            style={{ margin: 0, padding: 0 }}
            width={5}
          >
            <Header
              as={"h4"}
              textAlign={"right"}
              style={{
                margin: 0,
                marginLeft: 5,
                padding: 0,
                color: props.color,
              }}
            >
              {/* 매도 주문 잔량 */}
              {props.sellVolume}
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment.Group>

    // <Segment.Group style={{ flex: 1, margin: 0, padding: 0 }}>
    //   <Grid style={{ margin: 0, padding: 5 }}>
    //     <Grid.Row style={{ margin: 0, padding: 0 }} textAlign="center">
    //       <Grid.Column
    //         verticalAlign={"middle"}
    //         stretched
    //         style={{ margin: 0, padding: 0 }}
    //         width={4}
    //       >
    //         <Header
    //           as={"h4"}
    //           textAlign={"left"}
    //           style={{ margin: 0, marginLeft: 5, padding: 0 }}
    //         >
    //           {/* 매수 주문 잔량 */}
    //           {props.buyVolume}
    //         </Header>
    //       </Grid.Column>
    //       <Grid.Column
    //         verticalAlign={"middle"}
    //         stretched
    //         style={{ margin: 0, padding: 0 }}
    //         width={4}
    //       >
    //         <Container
    //           fluid
    //           style={{
    //             display: "flex",
    //             flexDirection: "row",
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Header
    //             as={"h4"}
    //             color="green"
    //             textAlign={"right"}
    //             style={{ flex: 1, margin: 0, padding: 0, marginRight: 5 }}
    //           >
    //             {/* 매수 주문 가격 */}
    //             {props.buyPrice}
    //           </Header>
    //         </Container>
    //       </Grid.Column>

    //       <Grid.Column
    //         verticalAlign={"middle"}
    //         stretched
    //         style={{ margin: 0, padding: 0 }}
    //         width={4}
    //       >
    //         <Container
    //           fluid
    //           style={{
    //             display: "flex",
    //             flexDirection: "row",
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Header
    //             as={"h4"}
    //             color="red"
    //             textAlign={"left"}
    //             style={{ flex: 1, margin: 0, padding: 0, marginLeft: 5 }}
    //           >
    //             {/* 매도 주문 가격 */}
    //             {props.sellPrice}
    //           </Header>
    //         </Container>
    //       </Grid.Column>

    //       <Grid.Column
    //         verticalAlign={"middle"}
    //         stretched
    //         style={{ margin: 0, padding: 0 }}
    //         width={4}
    //       >
    //         <Header
    //           as={"h4"}
    //           textAlign={"right"}
    //           style={{ margin: 0, padding: 0, marginRight: 5 }}
    //         >
    //           {/* 매도 주문 잔량 */}
    //           {props.sellVolume}
    //         </Header>
    //       </Grid.Column>
    //     </Grid.Row>
    //   </Grid>
    // </Segment.Group>
  );
};

export default TokenOrderBookElement;
