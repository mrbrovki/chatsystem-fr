import { MouseEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import { PanelMode } from "../context/types";

export const StyledAvatar = styled.img`
  width: 4rem;
  height: 4rem;
  background-color: white;
  margin: 0.5rem 0;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 8px #00000026;

  @media screen and (max-width: ${(props) => props.theme.breakpoints.xl}) {
    width: 3.5rem;
    height: 3.5rem;
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
    width: 3rem;
    height: 3rem;
  }
`;

const StyledChatItem = styled.div`
  padding-left: 2rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  gap: 10px;
  width: 100%;

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.25rem;
  }

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }

  &:hover {
    cursor: pointer;
  }
`;

const CheckBox = styled.img`
  margin-left: auto;
  margin-right: 2rem;
`;

const StyledCounter = styled.div`
  display: block;
  background-color: #43a5dc;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50%;
  line-height: 24px;
  width: 24px;
  text-align: center;
`;

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #00000023;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
`;

type CheckBox = "checked" | "unchecked";

const ChatItem = (props: any) => {
  const {
    state: { panelMode },
  } = useContext(Context);

  const [status, setStatus] = useState<CheckBox>("unchecked");

  const { name, image, handleClick, unreadCount, isSelectMode, ...restProps } =
    props;

  const toggleSelect = (e: MouseEvent<HTMLDivElement>) => {
    handleClick(e);
    setStatus((prev) => (prev === "checked" ? "unchecked" : "checked"));
  };

  switch (panelMode) {
    case PanelMode.CREATE_GROUP:
    case PanelMode.USER_CHATS: {
      if (isSelectMode) {
        return (
          <StyledChatItem {...restProps} onClick={toggleSelect}>
            <StyledAvatar src={image} />
            <Wrapper>
              <div>{name}</div>
              {unreadCount ? (
                <StyledCounter>{unreadCount}</StyledCounter>
              ) : (
                <></>
              )}
              <CheckBox src={`${status}-icon.svg`} width={18} height={18} />
            </Wrapper>
          </StyledChatItem>
        );
      } else {
        return (
          <StyledChatItem {...restProps} onClick={handleClick}>
            <StyledAvatar src={image} />
            <Wrapper>
              <div>{name}</div>
              {unreadCount ? (
                <StyledCounter>{unreadCount}</StyledCounter>
              ) : (
                <></>
              )}
            </Wrapper>
          </StyledChatItem>
        );
      }
    }
    default: {
      return (
        <StyledChatItem {...restProps} onClick={handleClick}>
          <StyledAvatar src={image} />
          <Wrapper>
            <div>{name}</div>
            {unreadCount ? <StyledCounter>{unreadCount}</StyledCounter> : <></>}
          </Wrapper>
        </StyledChatItem>
      );
    }
  }
};

export default ChatItem;
