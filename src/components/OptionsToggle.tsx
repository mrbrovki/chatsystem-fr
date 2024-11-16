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
const StyledIcons = styled.div<{ $isChecked: boolean; $position: string }>`
  display: flex;
  flex-flow: row nowrap;

  span {
    display: none;
  }
  & > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  @media only screen and (max-width: ${(props) => props.theme.breakpoints.xl}) {
    width: 15rem;
    display: block;
    ${({ $position }) => {
      if ($position === "left") {
        return css`
          left: 1.5rem;
          top: 2rem;
        `;
      } else {
        return css`
          right: 3rem;
          top: 3rem;
        `;
      }
    }}
    position: absolute;
    z-index: 1000;
    background-color: white;
    width: 12rem;
    box-shadow: 0 0 8px #00000042;

    & > div {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      padding: 0.5rem 1rem;
    }

    span {
      display: block;
    }
  }

  img {
    width: 32px;
    height: 32px;
  }

  ${({ $isChecked }) => {
    if (!$isChecked) {
      return css`
        display: none;
      `;
    }
  }}
`;
const Overlay = styled.div`
  @media only screen and (max-width: ${(props) => props.theme.breakpoints.xl}) {
    position: fixed;
    width: 100vw;
    height: 100dvh;
    left: 0;
    top: 0;
    z-index: 1;
  }
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
      {isChecked && (
        <>
          <Overlay onClick={toggle} />
          <StyledIcons
            $isChecked={isChecked}
            onClick={toggle}
            $position={props.position}
          >
            {props.children}
          </StyledIcons>
        </>
      )}
    </StyledOptions>
  );
};

export default OptionsToggle;
