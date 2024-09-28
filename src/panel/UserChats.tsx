import { MouseEvent, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import ChatList from "../chat/ChatList";
import { ActionType, Chat, ChatType, PanelMode } from "../context/types";

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
    state: { privateChats, groupChats, botChats, messages },
    dispatch,
  } = useContext(Context);
  const [chats, setChats] = useState<Chat[]>([]);

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
            unreadCount: 0,
            lastReadTime: 0,
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
            unreadCount: 0,
            lastReadTime: 0,
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
            unreadCount: 0,
            lastReadTime: 0,
          },
        });
        break;
    }
  };

  const switchToCreateMode = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.CREATE_CHAT });
  };

  const getLastMessageTimestamp = (chat: Chat) => {
    switch (chat.type) {
      case ChatType.PRIVATE: {
        let timestamp = 0;
        const chatMessages = messages[chat.type][chat.username];
        if (chatMessages && chatMessages.length > 0) {
          timestamp = chatMessages[chatMessages.length - 1].timestamp;
        }
        return timestamp;
      }
      case ChatType.BOT: {
        let timestamp = 0;
        const chatMessages = messages[chat.type][chat.botName];
        if (chatMessages && chatMessages.length > 0) {
          timestamp = chatMessages[chatMessages.length - 1].timestamp;
        }
        return timestamp;
      }
      case ChatType.GROUP: {
        let timestamp = 0;
        const chatMessages = messages[chat.type][chat.id];
        if (chatMessages && chatMessages.length > 0) {
          timestamp = chatMessages[chatMessages.length - 1].timestamp;
        }
        return timestamp;
      }
    }
  };
  useEffect(() => {
    const allChats = [...privateChats, ...groupChats, ...botChats] as Chat[];
    const sortedChats = allChats.sort((chat1: Chat, chat2: Chat) => {
      return getLastMessageTimestamp(chat2) - getLastMessageTimestamp(chat1);
    });
    setChats(sortedChats);
  }, [privateChats, groupChats, botChats, messages]);

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
