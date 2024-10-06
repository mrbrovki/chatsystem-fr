import { MouseEvent, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import ChatList from "../chat/ChatList";
import {
  ActionType,
  Chat,
  ChatType,
  Message,
  PanelMode,
} from "../context/types";
import { getChatName } from "../utils/utils";

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
    const chatName = getChatName(chat);

    let timestamp = 0;
    const chatMessages = messages[chat.type][chatName];
    if (chatMessages && chatMessages.length > 0) {
      timestamp = chatMessages[chatMessages.length - 1].timestamp;
    }
    return timestamp;
  };

  const highestLower = (arr: Message[], timestamp: number): number => {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid].timestamp < timestamp) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  };

  const countUnreadMessages = (
    chatType: ChatType,
    chatName: string,
    lastReadTime: number
  ) => {
    let counter = 0;
    const chatMessages = messages[chatType][chatName];
    if (chatMessages) {
      counter =
        chatMessages.length - highestLower(chatMessages, lastReadTime) - 1;
    }
    return counter;
  };

  useEffect(() => {
    const allChats = [...privateChats, ...groupChats, ...botChats] as Chat[];

    allChats.forEach((chat) => {
      const chatName = getChatName(chat);
      chat.unreadCount = countUnreadMessages(
        chat.type,
        chatName,
        chat.lastReadTime
      );
    });

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
