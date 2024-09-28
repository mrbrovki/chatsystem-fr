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
`;

const Overlay = styled.div`
  background-color: #393939e8;
  height: 48px;
  width: 48px;
  border-radius: 48px;
  position: absolute;
  overflow-y: hidden;
`;

const StyledChatItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  padding: 8px;

  &:hover {
    box-shadow: 0 0 2px #0000002e;
    border-radius: 20px;
    cursor: pointer;
  }
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
  const { name, image, handleClick, unreadCount, ...restProps } = props;
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
    case PanelMode.CREATE_GROUP:
      return (
        <StyledChatItem {...restProps} onClick={toggleSelect}>
          {isSelected || <Overlay />}
          {children}
        </StyledChatItem>
      );
    case PanelMode.USER_CHATS:
      return (
        <StyledChatItem {...restProps} onClick={toggleSelect}>
          {children}
        </StyledChatItem>
      );
    case PanelMode.CREATE_CHAT:
      return (
        <StyledChatItem {...restProps} onClick={handleClick}>
          {children}
        </StyledChatItem>
      );
    default:
      return <StyledChatItem {...restProps}>{children}</StyledChatItem>;
  }
}
