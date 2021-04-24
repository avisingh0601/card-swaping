import React from "react";
import styled from "styled-components";
import { animated } from "react-spring";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

export default ({ dragHandle, fixed, title, isVisible, style }) =>
  isVisible ? (
    <Wrapper style={style} raised>
      <Header {...dragHandle} title={title} fixed={fixed && fixed.toString()} />
    </Wrapper>
  ) : null;

const Header = styled(CardHeader)`
  cursor: ${(props) => (!props.fixed ? "pointer" : "auto")};
`;

const Wrapper = animated(styled(Card).attrs({})`
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 60%;
  height: 70vh;
  transform-origin: 50% 50%;
  overflow: hidden;
`);
