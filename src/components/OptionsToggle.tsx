import { useState } from "react";
import styled, { css } from "styled-components";

const StyledDots = styled.div<{ $isChecked: boolean; $count: number }>`
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-out;
  transform: rotateZ(90deg);

  div,
  div:before,
  div:after {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 20px;
    background-color: #000;
    transform: rotate(270deg);
    cursor: pointer;
  }
  div:before,
  div:after {
    content: "";
    position: absolute;
  }

  div:before {
    right: 10px;
    transition: right 0.3s ease-out, width 0.3s ease-out;
  }

  div:after {
    left: 10px;
    transition: left 0.3s ease-out, width 0.3s ease-out;
  }

  ${({ $isChecked }) => {
    if ($isChecked) {
      return css`
        div:before {
          right: -8px;
          width: 22px;
          transform: rotate(225deg);
        }

        div:after {
          left: -8px;
          width: 22px;
          transform: rotate(135deg);
        }
      `;
    }
  }}
`;
const StyledIcons = styled.div<{ $isChecked: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
  }
  img:hover {
    cursor: pointer;
  }
  ${({ $isChecked }) => {
    if (!$isChecked) {
      return css`
        display: none;
      `;
    }
  }}
`;

const StyledOptions = styled.div`
  height: 32px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const OptionsToggle = (props: any) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <StyledOptions>
      <StyledDots onClick={toggle} $isChecked={isChecked} $count={props.count}>
        <div></div>
      </StyledDots>
      <StyledIcons $isChecked={isChecked}>{props.children}</StyledIcons>
    </StyledOptions>
  );
};

export default OptionsToggle;
