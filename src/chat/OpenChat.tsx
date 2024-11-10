/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DragEvent,
  forwardRef,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getChatName, saveFile } from "../utils/utils";
import styled, { css } from "styled-components";
import { StyledAvatar } from "./ChatItem";
import { Context } from "../context";
import {
  ActionType,
  Chat,
  Chats,
  ChatType,
  InfoChat,
  InfoMessages,
  Message,
  Messages,
  MessageType,
  PanelMode,
} from "../context/types";
import { Client, Message as StompMessage } from "@stomp/stompjs";
import MessageComposer from "./MessageComposer";
import {
  getGroupById,
  getFileById,
  getMessages,
  getAllChats,
  getPrivateChats,
  deletePrivateChat,
  getInfo,
} from "../utils/requests";
import { sendFile } from "../utils/stompUtils";
import OptionsToggle from "../components/OptionsToggle";
import { WEBSOCKET } from "../constants";
import ChatContent from "./ChatContent";

const StyledChat = styled.div<{ $isFocused: boolean; $isDrag: boolean }>`
  background-color: ${(props) => props.theme.colors.panel.background};
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;

  & > section {
    gap: 10px;
    overflow-y: scroll;
    padding: 20px 16px 16px 16px;
    display: flex;
    flex: 1;
    flex-flow: column nowrap;
  }

  @media only screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    flex: ${(props: any) => (props.$isFocused ? 1 : 1)};
    opacity: ${(props: any) => (props.$isFocused ? 1 : 0.3)};
    transition: all 0.3s;
    position: relative;

    ${({ $isDrag }) => {
      if ($isDrag) {
        return css`
          flex: 1;
          background-color: #0000009;
        `;
      }
    }}
  }

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    position: absolute;
    width: 100vw;
    top: 0;
    bottom: 0;
    left: 100%;

    transition: transform 0.3s;
    ${(props: any) => {
      if (props.$isFocused) {
        return css`
          transform: translateX(-100%);
        `;
      } else {
        return css`
          transform: translateX(0);
        `;
      }
    }};
  }
`;

const StyledChatHeader = styled.div`
  height: 5rem;
  padding: 0 20px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--components-border-radius) var(--components-border-radius)
    0 0;
  background-color: ${(props) => props.theme.colors.chat.header};
  border-bottom: solid 1px #e1e1e1;

  & > img:first-child {
    &:hover {
      cursor: pointer;
    }
    @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
      display: none;
    }
  }
`;

const StyledCurrentChat = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-left: 1rem;
    margin-right: auto;

    img {
      width: 48px;
      height: 48px;
    }
  }
`;
type PropsType = object;

const OpenChat = forwardRef<Client, PropsType>((_props, ref) => {
  const stompClientRef = ref as MutableRefObject<Client>;
  const {
    state: {
      username,
      currentChat,
      panelMode,
      messages,
      privateChats,
      botChats,
    },
    dispatch,
  } = useContext(Context);

  const [imageSrc, setImageSrc] = useState("/user-icon.svg");
  const [name, setName] = useState("");
  const [isDrag, setIsDrag] = useState(false);

  const messagesRef = useRef<Messages>(messages);

  const connectToWebsocket = (chats: Chats) => {
    const socket = new WebSocket(WEBSOCKET);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("attempting connect!");
        //  subscribe to private channel
        stompClient.subscribe(
          "/user/" + username + "/private/messages",
          (messageObj) =>
            onPrivateMessageReceived(
              stompClient,
              messageObj,
              messagesRef.current
            )
        );

        //  subscribe to bot channel
        stompClient.subscribe(
          "/user/" + username + "/bot/messages",
          (messageObj) =>
            onBotMessageReceived(stompClient, messageObj, messagesRef.current)
        );
        //  subscribe to group channels
        chats[ChatType.GROUP].forEach((chat) => {
          const groupId = chat.id;
          subscribeToGroup(stompClient, groupId);
        });
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 200,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    stompClient.activate();

    stompClientRef.current = stompClient;
  };

  const initChats = (chats: Chats) => {
    dispatch({
      type: ActionType.PRIVATE_CHATS,
      payload: chats[ChatType.PRIVATE],
    });
    dispatch({
      type: ActionType.GROUP_CHATS,
      payload: chats[ChatType.GROUP],
    });
    dispatch({
      type: ActionType.BOT_CHATS,
      payload: chats[ChatType.BOT],
    });
  };

  const subscribeToGroup = async (stompClient: Client, groupId: string) => {
    stompClient.subscribe("/group/" + groupId + "/messages", (messageObj) =>
      onGroupMessageReceived(
        stompClient,
        messageObj,
        groupId,
        messagesRef.current
      )
    );
  };

  const onBotMessageReceived = async (
    _stompClient: Client,
    messageObj: StompMessage,
    _messages: Messages
  ) => {
    if (messageObj.headers["content-type"] === MessageType.APPLICATION_JSON) {
      const message = JSON.parse(messageObj.body) as Message;
      switch (message.type) {
        case MessageType.TEXT:
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: ChatType.BOT,
              chatName: message.senderName,
              message: message,
            },
          });
          break;
      }
      dispatch({
        type: ActionType.ADD_BOT_UNREAD,
        payload: { chatName: message.senderName },
      });
    }
  };

  const onGroupMessageReceived = (
    _stompClient: Client,
    messageObj: StompMessage,
    groupId: string,
    _messages: Messages
  ) => {
    if (messageObj.headers["content-type"] === MessageType.APPLICATION_JSON) {
      const message = JSON.parse(messageObj.body) as Message;
      switch (message.type) {
        case MessageType.TEXT: {
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: ChatType.GROUP,
              chatName: groupId,
              message: message,
            },
          });
          break;
        }
      }
    } else {
      handleFileReceive(messageObj, ChatType.GROUP, groupId);
    }
    dispatch({
      type: ActionType.ADD_GROUP_UNREAD,
      payload: { chatName: groupId },
    });
  };

  const onPrivateMessageReceived = async (
    stompClient: Client,
    messageObj: StompMessage,
    messages: Messages
  ) => {
    let senderName;
    if (messageObj.headers["content-type"] === MessageType.APPLICATION_JSON) {
      const message = JSON.parse(messageObj.body) as Message;
      switch (message.type) {
        case MessageType.JOIN: {
          const groupId = message.content as string;
          const groupChat = await getGroupById(groupId);
          subscribeToGroup(stompClient, groupId);
          dispatch({ type: ActionType.ADD_GROUP_CHAT, payload: groupChat });

          //join message?
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: ChatType.BOT,
              chatName: groupChat.id,
              message: message,
            },
          });
          break;
        }
        case MessageType.TEXT: {
          senderName = message.senderName;
          if (!messages[ChatType.PRIVATE][message.senderName]) {
            const newChats = await getPrivateChats();
            dispatch({ type: ActionType.PRIVATE_CHATS, payload: newChats });
          }

          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: ChatType.PRIVATE,
              chatName: message.senderName,
              message: message,
            },
          });

          dispatch({
            type: ActionType.ADD_PRIVATE_UNREAD,
            payload: { chatName: senderName },
          });
          break;
        }
      }
    } else {
      senderName = messageObj.headers["sender"];
      if (!messages[ChatType.PRIVATE][senderName]) {
        const newChats = await getPrivateChats();
        dispatch({ type: ActionType.PRIVATE_CHATS, payload: newChats });
      }

      dispatch({
        type: ActionType.ADD_PRIVATE_UNREAD,
        payload: { chatName: senderName },
      });

      handleFileReceive(messageObj, ChatType.PRIVATE);
    }
  };

  const handleFileReceive = (
    messageObj: StompMessage,
    chatType: ChatType,
    chatName?: string
  ) => {
    const blob = new Blob([messageObj.binaryBody], {
      type: messageObj.headers["contentType"],
    });
    const senderName = messageObj.headers["sender"];
    saveFile(dispatch, blob, senderName, chatType, chatName || senderName);
  };

  const loadMessages = async () => {
    const messages = await getMessages();
    dispatch({ type: ActionType.MESSAGES, payload: messages });
    return messages;
  };

  const loadFiles = async (messages: Messages) => {
    for (const key in messages) {
      const chatType = key as keyof Messages;

      for (const id in messages[chatType]) {
        const chatMessages = messages[chatType][id];
        const newChatMessages = await Promise.all<Message>(
          chatMessages.map(async (message) => {
            if (message.type === MessageType.TEXT) {
              return message;
            } else {
              const params = {
                chatName: id,
                chatType: chatType,
                senderName: message.senderName,
              };
              const blob = await getFileById(message.content, params);
              const url = URL.createObjectURL(blob);
              const newMessage = { ...message, content: url };
              return newMessage;
            }
          })
        );

        dispatch({
          type: ActionType.CHAT_MESSAGES,
          payload: {
            chatName: id,
            chatType: chatType,
            chatMessages: newChatMessages,
          },
        });
      }
    }
  };

  const onChatFocus = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const dragover = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const dragleave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDrag(false);
  };

  const drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentChat) return;
    [...e.dataTransfer.files].forEach(async (file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
      const receiverName = getChatName(currentChat);
      sendFile(file, currentChat as Chat, receiverName, stompClientRef.current);
      saveFile(
        dispatch,
        file,
        username,
        currentChat.type as ChatType,
        receiverName
      );
    });
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getAllChats();
        connectToWebsocket(chats);
        initChats(chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    const loadMessagesAndFiles = async () => {
      try {
        const loadedMessages = await loadMessages();
        loadFiles(loadedMessages);
      } catch (error) {
        console.error("Error loading messages or files:", error);
      }
    };

    const initInfo = async () => {
      const response = (await getInfo()) as InfoMessages;
      const infoChats = [];
      for (const key in response) {
        const infoChat = {
          name: key,
          image: "",
          unreadCount: 0,
          type: "info",
          lastReadTime: 0,
        } as InfoChat;
        infoChats.push(infoChat);
      }

      dispatch({ type: ActionType.INFO_CHATS, payload: infoChats });
      dispatch({ type: ActionType.INFO_MESSAGES, payload: response });
    };

    initInfo();
    fetchChats();
    loadMessagesAndFiles();
    initInfo();
  }, []);

  useEffect(() => {
    if (stompClientRef.current) {
      //  subscribe to private channel
      stompClientRef.current.subscribe(
        "/user/" + username + "/private/messages",
        (messageObj) =>
          onPrivateMessageReceived(
            stompClientRef.current,
            messageObj,
            messagesRef.current
          )
      );

      //  subscribe to bot channel
      stompClientRef.current.subscribe(
        "/user/" + username + "/bot/messages",
        (messageObj) =>
          onBotMessageReceived(
            stompClientRef.current,
            messageObj,
            messagesRef.current
          )
      );
    }

    return () => {
      if (stompClientRef.current) {
        if (stompClientRef.current.active) {
          stompClientRef.current.unsubscribe(
            "/user/" + username + "/private/messages"
          );
          stompClientRef.current.unsubscribe(
            "/user/" + username + "/bot/messages"
          );
        }
      }

      const newMessages: any = {};
      for (const key in messagesRef.current) {
        const chatType = key as keyof Messages;
        newMessages[chatType] = {};
        for (const id in messagesRef.current[chatType]) {
          const chatMessages = messagesRef.current[chatType][id];
          const newChatMessages = chatMessages.map((message: Message) => {
            const newMessage = { ...message } as Message;
            if (newMessage.senderName === username) {
              newMessage.senderName = "";
            }
            return newMessage;
          });
          newMessages[chatType][id] = newChatMessages;
        }
      }
      dispatch({
        type: ActionType.MESSAGES,
        payload: newMessages as Messages,
      });
    };
  }, [username]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!currentChat) return;
    switch (currentChat.type) {
      case ChatType.PRIVATE:
        setName(currentChat.username);
        setImageSrc(currentChat.avatar);
        break;
      case ChatType.GROUP:
        setName(currentChat.name);
        setImageSrc(currentChat.image);
        break;

      case ChatType.BOT:
        setName(currentChat.botName);
        setImageSrc(currentChat.avatar);
        break;
      case "info": {
        setName(currentChat.name);
        setImageSrc(currentChat.image);
      }
    }
  }, [currentChat]);

  const back = () => {
    dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
  };

  const deleteChat = async () => {
    if (!currentChat) return;
    switch (currentChat.type) {
      case ChatType.PRIVATE: {
        const newPrivateChats = privateChats.filter(
          (chat) => chat.username != currentChat.username
        );
        dispatch({ type: ActionType.PRIVATE_CHATS, payload: newPrivateChats });

        const newPrivateMessages = {
          ...messages[ChatType.PRIVATE],
        };
        delete newPrivateMessages[currentChat.username];

        dispatch({
          type: ActionType.MESSAGES,
          payload: {
            ...messages,
            [ChatType.PRIVATE]: newPrivateMessages,
          },
        });

        dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
        deletePrivateChat(currentChat.username, false);
        break;
      }
      case ChatType.BOT: {
        const newBotChats = botChats.filter(
          (chat) => chat.botName != currentChat.botName
        );
        dispatch({ type: ActionType.BOT_CHATS, payload: newBotChats });

        const newBotMessages = {
          ...messages[ChatType.BOT],
        };
        delete newBotMessages[currentChat.botName];

        dispatch({
          type: ActionType.MESSAGES,
          payload: {
            ...messages,
            [ChatType.BOT]: newBotMessages,
          },
        });

        dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
        deletePrivateChat(currentChat.botName, false);
        break;
      }
      case ChatType.GROUP: {
        /*
        const newGroupChats = groupChats.filter(
          (chat) => chat.name != currentChat.name
        );
        dispatch({ type: ActionType.GROUP_CHATS, payload: newGroupChats });

        const newGroupMessages = {
          ...messages[ChatType.GROUP],
        };
        delete newGroupMessages[currentChat.name];

        dispatch({
          type: ActionType.MESSAGES,
          payload: {
            ...messages,
            [ChatType.GROUP]: newGroupMessages,
          },
        });

        dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
        deletePrivateChat(currentChat.name, false);
        */
        break;
      }
    }
  };

  const optionsChildren = (
    <>
      <img src="/trash-icon.svg" onClick={deleteChat} />
    </>
  );

  return (
    <StyledChat
      onDragOver={dragover}
      onDragLeave={dragleave}
      onDrop={drop}
      $isDrag={isDrag}
      $isFocused={panelMode === PanelMode.USER_CHATS && currentChat != null}
      onClick={onChatFocus}
    >
      {currentChat && (
        <>
          <StyledChatHeader>
            <img src="/back-icon.svg" height={30} onClick={back} />
            <StyledCurrentChat>
              <StyledAvatar src={imageSrc} />
              <div>{name}</div>
            </StyledCurrentChat>
            <OptionsToggle children={optionsChildren} count={1} />
          </StyledChatHeader>
          <ChatContent />

          {currentChat.type !== "info" && (
            <MessageComposer ref={stompClientRef} />
          )}
        </>
      )}
    </StyledChat>
  );
});
export default OpenChat;
