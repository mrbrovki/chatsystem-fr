import { MouseEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import { PanelMode } from "../context/types";

export const StyledAvatar = styled.img`
  box-shadow: 0 0 2px #00000072;
  border-radius: 48px;
  float: left;
  height: 48px;
  width: 48px;

  @media only screen and (max-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    width: 64px;
    height: 64px;
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
  @media only screen and (max-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    font-size: 1.25rem;
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

export default function ChatItem(props: any) {
  const {
    state: { panelMode },
  } = useContext(Context);
  const [isSelected, setIsSelected] = useState(false);
  const { name, image, handleClick, unreadCount, isSelectMode, ...restProps } =
    props;
  const defaultURL = image;
  const avatarURL = defaultURL;

  const toggleSelect = (e: MouseEvent<HTMLDivElement>) => {
    handleClick(e);
    setIsSelected((prev) => !prev);
  };

  const children = (
    <>
      <StyledAvatar src={avatarURL} />
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
}
