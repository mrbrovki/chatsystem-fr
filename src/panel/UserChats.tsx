import { MouseEvent, useContext } from "react";
import styled from "styled-components";
import { Context } from "../context";
import ChatList from "../chat/ChatList";
import { ActionType, ChatType, PanelMode } from "../context/types";

const StyledHeader = styled.header`
  & > h1 {
    font-weight: 700;
    float: left;
  }
  & > img {
    float: right;
  }
`;

export default function UserChats() {
  const {
    state: { privateChats, groupChats, botChats },
    dispatch,
  } = useContext(Context);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const imageSrc = e.currentTarget.firstElementChild?.getAttribute(
      "src"
    ) as string;
    const name = e.currentTarget.getAttribute("data-name") as string;

    switch (e.currentTarget.getAttribute("data-type")) {
      case ChatType.GROUP.toString():
        dispatch({
          type: ActionType.CURRENT_CHAT,
          payload: {
            id: e.currentTarget.getAttribute("data-id")!,
            name: name,
            image: imageSrc,
            type: ChatType.GROUP,
          },
        });
        break;
      case ChatType.PRIVATE.toString():
        dispatch({
          type: ActionType.CURRENT_CHAT,
          payload: {
            username: name,
            avatar: imageSrc,
            type: ChatType.PRIVATE,
          },
        });
        break;
      case ChatType.BOT.toString():
        dispatch({
          type: ActionType.CURRENT_CHAT,
          payload: {
            botName: name,
            avatar: imageSrc,
            type: ChatType.BOT,
          },
        });
        break;
    }
  };

  const switchToCreateMode = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.CREATE_CHAT });
  };

  const chats = [...privateChats, ...groupChats, ...botChats];

  return (
    <>
      <StyledHeader>
        <h1>Chat</h1>
        <img
          src="./public/edit-icon.svg"
          width={30}
          height={30}
          onClick={switchToCreateMode}
        />
      </StyledHeader>
      <ChatList chats={chats} handleClick={handleClick} />
    </>
  );
}
