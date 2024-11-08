import { MouseEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import { PanelMode } from "../context/types";

export const StyledAvatar = styled.img`
  box-shadow: 0 0 2px #00000072;
  border-radius: 48px;
  float: left;
  width: 4rem;
  height: 4rem;

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
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  padding: 8px;
  width: 100%;
  margin-top: 4px;
  border-bottom: 1px #e8e8e8 solid;

  &:hover {
    box-shadow: 0 0 2px #0000002e;

    cursor: pointer;
  }
  @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.25rem;
  }

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const CheckBox = styled.img`
  left: 0;
  margin-left: auto;
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

const ChatItem = (props: any) => {
  const {
    state: { panelMode },
  } = useContext(Context);
  const [isSelected, setIsSelected] = useState(false);
  const { name, image, handleClick, unreadCount, isSelectMode, ...restProps } =
    props;

  const toggleSelect = (e: MouseEvent<HTMLDivElement>) => {
    handleClick(e);
    setIsSelected((prev) => !prev);
  };

  const children = (
    <>
      <StyledAvatar src={image} />
      <div>{name}</div>
      {unreadCount ? <StyledCounter>{unreadCount}</StyledCounter> : <></>}
    </>
  );

  switch (panelMode) {
    case PanelMode.CREATE_GROUP: {
      return (
        <StyledChatItem {...restProps} onClick={toggleSelect}>
          {children}
          {isSelected ? (
            <CheckBox src="/checked-icon.svg" width={18} height={18} />
          ) : (
            <CheckBox src="/unchecked-icon.svg" width={18} height={18} />
          )}
        </StyledChatItem>
      );
      break;
    }

    case PanelMode.USER_CHATS: {
      if (isSelectMode) {
        return (
          <StyledChatItem {...restProps} onClick={toggleSelect}>
            {children}
            {isSelected ? (
              <CheckBox src="/checked-icon.svg" width={18} height={18} />
            ) : (
              <CheckBox src="/unchecked-icon.svg" width={18} height={18} />
            )}
          </StyledChatItem>
        );
      } else {
        return (
          <StyledChatItem {...restProps} onClick={toggleSelect}>
            {children}
          </StyledChatItem>
        );
      }
      break;
    }

    case PanelMode.CREATE_CHAT: {
      return (
        <StyledChatItem {...restProps} onClick={handleClick}>
          {children}
        </StyledChatItem>
      );
      break;
    }

    default: {
      return <StyledChatItem {...restProps}>{children}</StyledChatItem>;
    }
  }
};

export default ChatItem;
