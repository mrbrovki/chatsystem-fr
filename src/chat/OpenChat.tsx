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
import { getChatName, padZero, saveFile } from "../utils/utils";
import styled, { css } from "styled-components";
import { StyledAvatar } from "./ChatItem";
import { Context } from "../context";
import {
  ActionType,
  Chat,
  Chats,
  ChatType,
  InfoChat,
  InfoMessage,
  InfoMessages,
  Message,
  Messages,
  MessageType,
  PanelMode,
} from "../context/types";
import { Client, Message as StompMessage } from "@stomp/stompjs";
import ReactPlayer from "react-player";
import MessageComposer from "./MessageComposer";
import {
  updateReadStatus,
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

const StyledChat = styled.div<{ $isFocused: boolean; $isDrag: boolean }>`
  & > section {
    gap: 10px;
    overflow-y: scroll;
    padding: 20px 16px 80px 16px;
    display: flex;
    flex-flow: column nowrap;
    height: calc(100% - 160px);
  }

  @media only screen and (min-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    flex: ${(props: any) => (props.$isFocused ? 8 : 4)};
    opacity: ${(props: any) => (props.$isFocused ? 1 : 0.3)};
    transition: all 0.3s;
    position: relative;

    ${({ $isDrag }) => {
      if ($isDrag) {
        return css`
          flex: 9;
          background-color: #0000009;
        `;
      }
    }}
  }

  @media only screen and (max-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    ${(props: any) => {
      if (props.$isFocused) {
        return css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        `;
      } else {
        return css`
          display: none;
        `;
      }
    }}
  }
`;

const StyledChatHeader = styled.div`
  height: 90px;
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
    @media only screen and (min-width: ${(props) =>
        props.theme.breakpoints.tablet}) {
      display: none;
    }
  }
`;

const StyledMessage = styled.div<{ $isSender: boolean; $isText: boolean }>`
  max-width: 24rem;
  align-self: ${({ $isSender }) => ($isSender ? "flex-end" : "flex-start")};

  .content {
    padding: 16px;
    box-shadow: 0 0 8px #00000042;

    a {
      color: inherit;
      word-wrap: break-word;
    }

    ${({ $isSender }) => {
      if ($isSender) {
        return css`
          border-radius: 20px 20px 0 20px;
          background-color: ${(props) =>
            props.theme.colors.message.self.background};
          color: ${(props) => props.theme.colors.message.self.text};
        `;
      } else {
        return css`
          border-radius: 20px 20px 20px 0;
          background-color: ${(props) =>
            props.theme.colors.message.other.background};
          color: ${(props) => props.theme.colors.message.other.text};
        `;
      }
    }}

    ${({ $isText }) => {
      if (!$isText) {
        return css`
          padding: 0px;
          overflow: hidden;
          border-radius: 10px;

          img {
            display: block;
          }
        `;
      }
    }}
  }
  & > span {
    color: #bfbfbf;
    font-weight: 600;
    font-size: 12px;
    float: ${({ $isSender }) => ($isSender ? "right" : "left")};
  }
`;

const StyledCurrentChat = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;

  @media only screen and (max-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
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
      groupChats,
      botChats,
      infoMessages,
    },
    dispatch,
  } = useContext(Context);

  const [imageSrc, setImageSrc] = useState("/user-icon.svg");
  const [name, setName] = useState("");
  const [content, setContent] = useState<any>([]);
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

  const updateReadCount = (
    chats: Chat[],
    prop: string,
    name: string,
    unreadCount: number
  ) => {
    return chats.map((chat: any) => {
      if (chat[prop] === name) {
        return {
          ...chat,
          lastReadTime: Date.now(),
          unreadCount,
        };
      }
      return chat;
    });
  };

  const parseMessageContent = (content: string): any => {
    const regex = /https:\/\/[^\s"']+|[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}/g;
    const parts = content.split(regex);
    const urls = content.match(regex) || [];

    return parts.reduce((acc: any, part, index) => {
      acc.push(<span key={`text-${index}`}>{part}</span>);

      if (index < urls.length) {
        if (urls[index].startsWith("https")) {
          acc.push(
            <a key={urls[index]} href={urls[index]} target="_blank">
              {urls[index]}
            </a>
          );
        } else {
          acc.push(
            <a key={urls[index]} href={"mailto:" + urls[index]} target="_blank">
              {urls[index]}
            </a>
          );
        }
      }
      return acc;
    }, []);
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

  useEffect(() => {
    if (!currentChat) return;
    let chatMessages: Message[] | InfoMessage[];

    switch (currentChat.type) {
      case ChatType.PRIVATE: {
        chatMessages = messages[currentChat.type][
          currentChat.username
        ] as Message[];
        dispatch({
          type: ActionType.PRIVATE_CHATS,
          payload: updateReadCount(
            privateChats,
            "username",
            currentChat.username,
            0
          ),
        });
        updateReadStatus(currentChat.type, currentChat.username);
        break;
      }
      case ChatType.GROUP: {
        chatMessages = messages[currentChat.type][currentChat.id] as Message[];
        dispatch({
          type: ActionType.GROUP_CHATS,
          payload: updateReadCount(groupChats, "id", currentChat.id, 0),
        });

        updateReadStatus(currentChat.type, currentChat.name);
        break;
      }
      case ChatType.BOT: {
        chatMessages = messages[currentChat.type][
          currentChat.botName
        ] as Message[];
        dispatch({
          type: ActionType.BOT_CHATS,
          payload: updateReadCount(botChats, "botName", currentChat.botName, 0),
        });

        updateReadStatus(currentChat.type, currentChat.botName);
        break;
      }
      case "info": {
        chatMessages = infoMessages[currentChat.name] as InfoMessage[];
      }
    }

    chatMessages = chatMessages ? chatMessages : [];

    const chatContent = chatMessages.map((chatMessage, index) => {
      const timestamp = chatMessage?.timestamp
        ? chatMessage.timestamp
        : Date.now();
      const date = new Date(timestamp);
      const senderName = chatMessage.senderName;
      const isSender = !senderName || senderName === username;
      console.log(chatMessage.type);
      switch (chatMessage.type) {
        case MessageType.TEXT: {
          return (
            <StyledMessage
              key={senderName + timestamp + index}
              $isText={true}
              $isSender={isSender}
            >
              <div className="content">
                {parseMessageContent(chatMessage.content)}
              </div>
              <span>
                {padZero(date.getHours()) + ":" + padZero(date.getMinutes())}
              </span>
            </StyledMessage>
          );
        }
        case MessageType.IMAGE_GIF:
        case MessageType.IMAGE_JPEG:
        case MessageType.IMAGE_PNG: {
          return (
            <StyledMessage
              key={senderName + timestamp + index}
              $isSender={isSender}
              $isText={false}
            >
              <div className="content">
                <a href={chatMessage.link} target="_blank">
                  <img src={chatMessage.content} width={320} />
                </a>
              </div>
              <span>
                {padZero(date.getHours()) + ":" + padZero(date.getMinutes())}
              </span>
            </StyledMessage>
          );
        }
        case MessageType.APPLICATION_PDF: {
          return (
            <StyledMessage
              key={senderName + timestamp + index}
              $isSender={isSender}
              $isText={false}
            >
              <div className="content">
                <a href={chatMessage.content} target="_blank">
                  <img src={"/pdf-icon.svg"} style={{ padding: 5 }} />
                </a>
              </div>
              <span>
                {padZero(date.getHours()) + ":" + padZero(date.getMinutes())}
              </span>
            </StyledMessage>
          );
        }
        case MessageType.VIDEO_AVI:
        case MessageType.VIDEO_MOV:
        case MessageType.VIDEO_WEBM:
        case MessageType.VIDEO_MP4:
          return (
            <StyledMessage
              key={senderName + chatMessage.timestamp}
              $isSender={isSender}
              $isText={false}
            >
              <ReactPlayer
                url={chatMessage.content}
                controls
                volume={1}
                height="100%"
                width="100%"
                style={{ borderRadius: 10, overflow: "hidden" }}
              />
            </StyledMessage>
          );
        case MessageType.SVG: {
          if (currentChat.type === "info") {
            return (
              <StyledMessage
                key={senderName + timestamp + index}
                $isSender={isSender}
                $isText={false}
              >
                <div className="content">
                  <a href={chatMessage.link} target="_blank">
                    <img src={chatMessage.content} width={128} />
                  </a>
                </div>
                <span>
                  {padZero(date.getHours()) + ":" + padZero(date.getMinutes())}
                </span>
              </StyledMessage>
            );
          } else {
            return (
              <StyledMessage
                key={senderName + timestamp + index}
                $isSender={isSender}
                $isText={false}
              >
                <div className="content">
                  <img src={chatMessage.content} width={64} />
                </div>
                <span>
                  {padZero(date.getHours()) + ":" + padZero(date.getMinutes())}
                </span>
              </StyledMessage>
            );
          }
        }
        default:
          return <></>;
      }
    });
    setContent(chatContent);
  }, [currentChat, messages, username]);

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
          <section>{content}</section>

          {currentChat.type !== "info" && (
            <MessageComposer ref={stompClientRef} />
          )}
        </>
      )}
    </StyledChat>
  );
});
export default OpenChat;
