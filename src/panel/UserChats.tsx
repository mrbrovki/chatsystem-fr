/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { Context } from "../context";
import ChatList from "../chat/ChatList";
import {
  ActionType,
  Chat,
  ChatType,
  Message,
  Messages,
  PanelMode,
} from "../context/types";
import { getChatName } from "../utils/utils";
import {
  getBotChats,
  getGroupById,
  getPrivateChatByName,
  getPrivateChats,
} from "../utils/requests";
import ProfilePicture from "../components/ProfilePicture";
import InputField from "../components/InputField";
import OptionsToggle from "../components/OptionsToggle";

const SettingsIcon = styled.img`
  filter: invert(1);
  transition: transform 0.3s;
  &:hover {
    transform: rotateZ(90deg);
  }

  @media only screen and (min-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const StyledHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px black solid;
  justify-content: flex-end;
  height: 48px;

  img:hover {
    cursor: pointer;
  }

  @media only screen and (min-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    img:nth-of-type(1) {
      display: none;
    }
  }

  h1 {
    left: 0;
    margin-right: auto;
  }
`;

const StyledControl = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  & > div:first-of-type {
    width: auto;
  }
`;

export default function UserChats() {
  const {
    state: { privateChats, groupChats, botChats, messages },
    dispatch,
  } = useContext(Context);
  const [chats, setChats] = useState<Chat[]>([]);
  const [fileredChats, setFilteredChats] = useState<Chat[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleChatClick = async (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.getAttribute("data-name") as string;
    if (isSelectMode) {
      console.log(name);
    } else {
      switch (e.currentTarget.getAttribute("data-type")) {
        case ChatType.GROUP:
          {
            const groupId = e.currentTarget.getAttribute("data-id")!;
            const newGroupChat = await getGroupById(groupId);
            const newGroupChats = groupChats.map((groupChat) => {
              if (groupChat.id === newGroupChat.id) {
                return groupChat;
              } else {
                return groupChat;
              }
            });
            dispatch({ type: ActionType.GROUP_CHATS, payload: newGroupChats });

            dispatch({
              type: ActionType.CURRENT_CHAT,
              payload: {
                id: newGroupChat.id,
                name: newGroupChat.name,
                image: newGroupChat.image,
                type: ChatType.GROUP,
                unreadCount: 0,
                lastReadTime: 0,
              },
            });
          }
          break;
        case ChatType.PRIVATE: {
          let newPrivateChat;
          try {
            newPrivateChat = await getPrivateChatByName(name);
          } catch {
            const index = privateChats.findIndex(
              (chat) => chat.username === name
            )!;
            const newPrivateChats = await getPrivateChats();
            newPrivateChat = newPrivateChats[index];

            dispatch({
              type: ActionType.PRIVATE_CHATS,
              payload: newPrivateChats,
            });

            const newPrivateMessages = {
              ...messages[ChatType.PRIVATE],
              [newPrivateChat.username]: messages[ChatType.PRIVATE][name],
            };
            delete newPrivateMessages[name];

            dispatch({
              type: ActionType.MESSAGES,
              payload: {
                ...messages,
                [ChatType.PRIVATE]: newPrivateMessages,
              },
            });
          }

          dispatch({
            type: ActionType.CURRENT_CHAT,
            payload: {
              username: newPrivateChat.username,
              avatar: newPrivateChat.avatar,
              type: ChatType.PRIVATE,
              unreadCount: 0,
              lastReadTime: 0,
            },
          });
          break;
        }
        case ChatType.BOT: {
          const index = botChats.findIndex(
            (botChat) => botChat.botName === name
          )!;
          const newBotChats = await getBotChats();
          const newBotChat = newBotChats[index];

          dispatch({
            type: ActionType.BOT_CHATS,
            payload: newBotChats,
          });

          dispatch({
            type: ActionType.CURRENT_CHAT,
            payload: {
              botName: newBotChat.botName,
              avatar: newBotChat.avatar,
              type: ChatType.BOT,
              unreadCount: 0,
              lastReadTime: 0,
            },
          });
          break;
        }
      }
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
    messages: Messages,
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
    let allChats = [...privateChats, ...groupChats, ...botChats] as Chat[];

    allChats = allChats.map((chat) => {
      const chatName = getChatName(chat);
      const newChat = { ...chat };
      newChat.unreadCount = countUnreadMessages(
        messages,
        chat.type,
        chatName,
        chat.lastReadTime
      );
      return newChat;
    });

    const sortedChats = allChats.sort((chat1: Chat, chat2: Chat) => {
      return getLastMessageTimestamp(chat2) - getLastMessageTimestamp(chat1);
    });
    setChats(sortedChats);
  }, [privateChats, groupChats, botChats, messages]);

  const switchToSettings = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.SETTINGS });
  };

  const switchToEdit = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.EDIT_PROFILE });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredChats(() => {
      const value = e.target.value.toLowerCase();
      if (value) {
        return chats.filter((chat) => {
          const name = getChatName(chat);
          return name.startsWith(value);
        });
      } else {
        return chats;
      }
    });
  };

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  const toggleSelect = () => {
    setIsSelectMode((prevMode) => {
      return !prevMode;
    });
  };
  const optionsChildren = (
    <>
      <img
        src="/select-icon.svg"
        width={32}
        height={32}
        onClick={toggleSelect}
      />
      <img src="/trash-icon.svg" width={32} height={32} onClick={undefined} />
    </>
  );
  return (
    <>
      <StyledHeader>
        <h1>Chat</h1>
        <ProfilePicture width={32} height={32} handleClick={switchToEdit} />
        <img
          src="/edit-icon.svg"
          width={32}
          height={32}
          onClick={switchToCreateMode}
        />
        <SettingsIcon
          src="/settings-icon.svg"
          width={32}
          height={32}
          onClick={switchToSettings}
        />
      </StyledHeader>
      <StyledControl>
        <InputField
          type={"text"}
          id="find-chat"
          placeholder="search"
          name="find-chat"
          handleChange={handleChange}
        />
        <OptionsToggle children={optionsChildren} count={2} />
      </StyledControl>

      <ChatList
        chats={fileredChats}
        handleClick={handleChatClick}
        isSelectMode={isSelectMode}
      />
    </>
  );
}
