/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChangeEvent,
  DragEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  fetchGroupById,
  fetchAllChats,
  fetchFileById,
  fetchMessages,
  fetchPrivateChatByName,
  jwtAuthHeader,
  fetchUpdateReadStatus,
} from "../utils/utils";
import styled, { css } from "styled-components";
import { StyledAvatar } from "./ChatItem";
import { Context } from "../context";
import {
  ActionType,
  Chat,
  Chats,
  ChatType,
  Message,
  Messages,
  MessageType,
  PanelMode,
} from "../context/types";
import { Client, Message as StompMessage } from "@stomp/stompjs";
import ReactPlayer from "react-player";

const StyledChat = styled.div<{ $isFocused: boolean; $isDrag: boolean }>`
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

  & > section {
    gap: 10px;
    overflow-y: scroll;
    padding: 20px 16px 80px 16px;
    display: flex;
    flex-flow: column nowrap;
    height: calc(100% - 160px);
  }
`;

const StyledChatHeader = styled.div`
  height: 90px;
  padding: 0 20px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  border-radius: var(--components-border-radius) var(--components-border-radius)
    0 0;
  background-color: #ffffff;
  border-bottom: solid 1px #e1e1e1;
`;

const StyledMessage = styled.div<{ $isSender: boolean; $isText: boolean }>`
  max-width: 320px;
  align-self: ${({ $isSender }) => ($isSender ? "flex-end" : "flex-start")};

  .content {
    padding: 16px;
    box-shadow: 0 0 8px #00000042;

    ${({ $isSender }) => {
      if ($isSender) {
        return css`
          border-radius: 20px 20px 0 20px;
          background-color: #43a5dc;
          color: #fff;
        `;
      } else {
        return css`
          border-radius: 20px 20px 20px 0;
          background-color: #d9d9d9;
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
            width: 100%;
            display: block;
          }
        `;
      }
    }}
  }
  span {
    color: #bfbfbf;
    font-weight: 600;
    font-size: 12px;
    float: ${({ $isSender }) => ($isSender ? "right" : "left")};
  }
`;

const StyledSend = styled.div`
  height: 70px;
  background-color: #ffffff;
  border-radius: 12px 12px 20px 20px;
  padding: 0 16px 0;
  position: relative;

  & > input {
    background-color: #f7f7f7;
    padding: 0 16px;
    height: 48px;
    width: 100%;
    border: none;
    box-shadow: 0 0 8px #00000026;
    border-radius: 12px;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #00000058;
    }
  }

  img {
    position: absolute;
    right: 24px;
    top: 8px;
    fill: black;

    &:hover {
      cursor: pointer;
    }
  }
`;

export default function OpenChat() {
  const {
    state: { username, currentChat, panelMode, messages, privateChats },
    dispatch,
  } = useContext(Context);
  const messageInput = useRef("");
  const [imageSrc, setImageSrc] = useState(
    `https://api.multiavatar.com/default.svg`
  );
  const [name, setName] = useState("");
  const [content, setContent] = useState<any>([]);
  const [isDrag, setIsDrag] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const messagesRef = useRef<Messages>();
  const contentRef = useRef<any>(null);

  const connectToWebsocket = (chats: Chats) => {
    const socket = new WebSocket("ws://localhost:8080/ws");
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
              messagesRef.current!
            ),
          jwtAuthHeader()
        );
        //  subscribe to bot channel
        stompClient.subscribe(
          "/user/" + username + "/bot/messages",
          (messageObj) =>
            onBotMessageReceived(stompClient, messageObj, messagesRef.current!),
          jwtAuthHeader()
        );
        //  subscribe to group channels
        chats[ChatType.GROUP].forEach((chat) => {
          const groupId = chat.id;
          subscribeToGroup(stompClient, groupId);
        });

        initChats(chats);
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

    dispatch({
      type: ActionType.CURRENT_CHAT,
      payload: chats[ChatType.PRIVATE][0],
    });
  };

  const subscribeToGroup = async (stompClient: Client, groupId: string) => {
    stompClient.subscribe(
      "/group/" + groupId + "/messages",
      (messageObj) =>
        onGroupMessageReceived(
          stompClient,
          messageObj,
          messagesRef.current!,
          groupId
        ),
      jwtAuthHeader()
    );
  };

  const onBotMessageReceived = async (
    stompClient: Client,
    messageObj: StompMessage,
    messages: Messages
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
    }
  };

  const onGroupMessageReceived = (
    stompClient: Client,
    messageObj: StompMessage,
    messages: Messages,
    groupId: string
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
  };

  const onPrivateMessageReceived = async (
    stompClient: Client,
    messageObj: StompMessage,
    messages: Messages
  ) => {
    let senderName;
    if (messageObj.headers["content-type"] === MessageType.APPLICATION_JSON) {
      const message = JSON.parse(messageObj.body) as Message;
      console.log(message);
      switch (message.type) {
        case MessageType.JOIN: {
          const groupId = message.content as string;
          const groupChat = await fetchGroupById(groupId);
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
            const newChat = await fetchPrivateChatByName(message.senderName);
            newChat.unreadCount = 0;
            dispatch({ type: ActionType.ADD_PRIVATE_CHAT, payload: newChat });
          }
          updateReadCount(privateChats, "username", message.senderName, 1);

          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: ChatType.PRIVATE,
              chatName: message.senderName,
              message: message,
            },
          });
          break;
        }
      }
    } else {
      senderName = messageObj.headers["sender"];
      if (!messages[ChatType.PRIVATE][senderName]) {
        const newChat = await fetchPrivateChatByName(senderName);
        console.log(newChat);
        dispatch({ type: ActionType.ADD_PRIVATE_CHAT, payload: newChat });
      }
      handleFileReceive(messageObj, ChatType.PRIVATE);
    }
    if (senderName) {
      dispatch({
        type: ActionType.ADD_PRIVATE_UNREAD,
        payload: { chatName: senderName },
      });
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
    saveFile(blob, senderName, chatType, chatName || senderName);
  };

  const saveFile = (
    data: Blob | File,
    senderName: string,
    chatType: ChatType,
    chatName: string
  ) => {
    const objectURL = URL.createObjectURL(data);
    const message = {
      timestamp: Date.now(),
      content: objectURL,
      type: data.type as MessageType,
      senderName: senderName,
    };
    dispatch({
      type: ActionType.ADD_MESSAGE,
      payload: {
        chatType: chatType,
        chatName: chatName,
        message: message,
      },
    });
  };

  const loadMessages = async () => {
    const messages = await fetchMessages();
    messagesRef.current = messages;
    dispatch({ type: ActionType.MESSAGES, payload: messages });
  };

  const loadFiles = async () => {
    const messages = messagesRef.current!;
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
              const blob = await fetchFileById(message.content, params);
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

  const onMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    messageInput.current = e.target.value;
  };

  const handleSend = async () => {
    if (!stompClientRef.current || !currentChat) return;
    let url: string;
    const message = {
      type: MessageType.TEXT,
      timestamp: Date.now(),
      content: messageInput.current,
      senderName: username,
    };

    switch (currentChat.type) {
      case ChatType.BOT:
        url = "/app/chat.sendToBot";
        stompClientRef.current.publish({
          destination: url,
          body: JSON.stringify({
            content: message.content,
            type: message.type,
            receiverName: currentChat.botName,
          }),
          headers: jwtAuthHeader(),
        });
        dispatch({
          type: ActionType.ADD_MESSAGE,
          payload: {
            chatType: ChatType.BOT,
            chatName: currentChat.botName,
            message: message,
          },
        });
        break;
      case ChatType.GROUP:
        url = "/app/chat.sendToGroup";
        stompClientRef.current.publish({
          destination: url,
          body: JSON.stringify({
            content: message.content,
            type: message.type,
            receiverName: currentChat.name,
          }),
          headers: jwtAuthHeader(),
        });
        dispatch({
          type: ActionType.ADD_MESSAGE,
          payload: {
            chatType: ChatType.GROUP,
            chatName: currentChat.name,
            message: message,
          },
        });
        break;
      case ChatType.PRIVATE: {
        url = "/app/chat.sendToPrivate";
        stompClientRef.current.publish({
          destination: url,
          body: JSON.stringify({
            content: message.content,
            type: message.type,
            receiverName: currentChat.username,
          }),
          headers: jwtAuthHeader(),
        });
        dispatch({
          type: ActionType.ADD_MESSAGE,
          payload: {
            chatType: ChatType.PRIVATE,
            chatName: currentChat.username,
            message: message,
          },
        });
        break;
      }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key == "Enter") {
      handleSend();
      e.currentTarget.value = "";
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
      const buffer = new Uint8Array(await file.arrayBuffer());
      let url;
      let receiverName;
      switch (currentChat.type) {
        case ChatType.PRIVATE:
          url = "/app/chat.sendFileToPrivate";
          receiverName = currentChat.username;
          break;
        case ChatType.BOT:
          url = "/app/chat.sendFileToBot";
          receiverName = currentChat.botName;
          break;
        case ChatType.GROUP:
          url = "/app/chat.sendFileToGroup";
          receiverName = currentChat.id;
          break;
      }

      if (!stompClientRef.current) return;
      stompClientRef.current.publish({
        destination: url!,
        binaryBody: buffer,
        headers: {
          ...jwtAuthHeader(),
          "file-type": file.type,
          "receiver-name": receiverName!,
          "content-type": "application/octet-stream",
        },
      });

      saveFile(file, username, currentChat.type, receiverName);
    });
  };

  const updateReadCount = (
    chats: Chat[],
    prop: string,
    name: string,
    unreadCount: number
  ) => {
    return chats.map((chat: any) => {
      console.log(chats);
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

  useEffect(() => {
    if (!messages || !currentChat) return;
    let chatMessages;

    switch (currentChat.type) {
      case ChatType.PRIVATE:
        chatMessages = messages[currentChat.type][currentChat.username];

        dispatch({
          type: ActionType.PRIVATE_CHATS,
          payload: updateReadCount(
            privateChats,
            "username",
            currentChat.username,
            0
          ),
        });

        fetchUpdateReadStatus(currentChat.type, currentChat.username);

        setName(currentChat.username);
        setImageSrc(currentChat.avatar);
        break;
      case ChatType.GROUP:
        chatMessages = messages[currentChat.type][currentChat.id];

        dispatch({
          type: ActionType.GROUP_CHATS,
          payload: updateReadCount(privateChats, "id", currentChat.id, 0),
        });

        fetchUpdateReadStatus(currentChat.type, currentChat.name);

        setName(currentChat.name);
        setImageSrc(currentChat.image);
        break;
      case ChatType.BOT:
        chatMessages = messages[currentChat.type][currentChat.botName];

        dispatch({
          type: ActionType.BOT_CHATS,
          payload: updateReadCount(
            privateChats,
            "botName",
            currentChat.botName,
            0
          ),
        });

        fetchUpdateReadStatus(currentChat.type, currentChat.botName);

        setName(currentChat.botName);
        setImageSrc(currentChat.avatar);
        break;
    }
    chatMessages = chatMessages ? chatMessages : [];
    const chatContent = chatMessages.map((chatMessage) => {
      const date = new Date(chatMessage.timestamp);
      switch (chatMessage.type) {
        case MessageType.TEXT: {
          return (
            <StyledMessage
              key={chatMessage.senderName + chatMessage.timestamp}
              $isText={true}
              $isSender={chatMessage.senderName === username}
            >
              <div className="content">
                {chatMessage.content.replace("{{user}}", username)}
              </div>
              <span>{date.getHours() + ":" + date.getMinutes()}</span>
            </StyledMessage>
          );
        }
        case MessageType.IMAGE_GIF:
        case MessageType.IMAGE_JPEG:
        case MessageType.IMAGE_PNG: {
          return (
            <StyledMessage
              key={chatMessage.senderName + chatMessage.timestamp}
              $isSender={chatMessage.senderName === username}
              $isText={false}
            >
              <div className="content">
                <img src={chatMessage.content} />
              </div>
              <span>{date.getHours() + ":" + date.getMinutes()}</span>
            </StyledMessage>
          );
        }
        case MessageType.APPLICATION_PDF: {
          return (
            <StyledMessage
              key={chatMessage.senderName + chatMessage.timestamp}
              $isSender={chatMessage.senderName === username}
              $isText={false}
            >
              <div className="content">
                <a href={chatMessage.content} target="_blank">
                  <img src={"./public/pdf-icon.svg"} style={{ padding: 5 }} />
                </a>
              </div>
              <span>{date.getHours() + ":" + date.getMinutes()}</span>
            </StyledMessage>
          );
        }
        case MessageType.VIDEO_AVI:
        case MessageType.VIDEO_MOV:
        case MessageType.VIDEO_WEBM:
        case MessageType.VIDEO_MP4:
          return (
            <StyledMessage
              key={chatMessage.senderName + chatMessage.timestamp}
              $isSender={chatMessage.senderName === username}
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
        default:
          return <></>;
      }
    });
    setContent(chatContent);
  }, [messages, currentChat]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    (async () => {
      const chats = await fetchAllChats();
      connectToWebsocket(chats);
    })();
    (async () => {
      await loadMessages();
      loadFiles();
    })();
  }, []);

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
        <StyledChatHeader>
          <StyledAvatar src={imageSrc} />
          <div>{name}</div>
        </StyledChatHeader>
      )}

      <section ref={contentRef}>{content}</section>

      {currentChat && (
        <StyledSend>
          <input
            type="text"
            name="message"
            id="message"
            placeholder="message or drag file"
            onChange={onMessageChange}
            onKeyDown={handleKeyPress}
          />
          <img
            onClick={handleSend}
            src="./send-message-icon.svg"
            width={32}
            height={32}
          />
        </StyledSend>
      )}
    </StyledChat>
  );
}
