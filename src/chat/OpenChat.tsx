import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import {
  fetchChatById,
  fetchChats,
  fetchMessages,
  fetchPrivateChats,
  getAuthHeader,
} from "../utils/utils";
import styled, { css } from "styled-components";
import { StyledAvatar } from "./ChatItem";
import { Context } from "../context";
import {
  ActionType,
  Chat,
  ChatType,
  Message,
  MessageType,
  PanelMode,
  PrivateChat,
} from "../context/types";
import { Client, Message as StompMessage } from "@stomp/stompjs";

const StyledChat = styled.div<{ $isFocused: boolean }>`
  flex: ${(props: any) => (props.$isFocused ? 8 : 4)};
  opacity: ${(props: any) => (props.$isFocused ? 1 : 0.3)};
  transition: all 0.3s;
  position: relative;

  & > section {
    gap: 10px;
    overflow-y: scroll;
    padding: 20px 16px 80px 16px;
    display: flex;
    flex-flow: column nowrap;
    overflow-y: scroll;
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

const StyledMessage = styled.div<{ $isSender: boolean }>`
  max-width: 320px;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 0 8px #00000026;

  ${(props: any) => {
    if (props.$isSender) {
      return css`
        background-color: #43a5dc;
        color: #fff;
        align-self: flex-end;
      `;
    } else {
      return css`
        background-color: #d9d9d9;
        align-self: flex-start;
      `;
    }
  }}
`;

const StyledSend = styled.div`
  height: 70px;
  background-color: #ffffff;
  border-radius: 12px 12px 20px 20px;
  padding: 0 16px 0;

  & > input {
    background-color: #f7f7f7;
    padding: 0 16px;
    height: 48px;
    width: 100%;
    border: none;
    box-shadow: 0 0 8px #00000026;
    border-radius: 12px;
  }
  & > input:focus {
    outline: none;
  }
`;

export default function OpenChat() {
  const {
    state: { username, currentChat, panelMode, privateChats },
    dispatch,
  } = useContext(Context);
  const messageInput = useRef("");
  const [imageSrc, setImageSrc] = useState(
    `https://api.multiavatar.com/default.svg`
  );
  const [name, setName] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const privateChatsRef = useRef<PrivateChat[]>([]);
  const currentChatRef = useRef<any>(null);

  const connectToWebsocket = async () => {
    // @ts-ignore
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: async () => {
        const chats = await fetchChats();
        privateChatsRef.current = chats.privateChats;
        console.log("attempting connect!");
        stompClient.subscribe(
          "/user/" + username + "/queue/messages",
          (messageObj) =>
            onPrivateMessageReceived(
              privateChatsRef.current,
              messageObj,
              currentChatRef.current!
            ),
          getAuthHeader()
        );
        dispatch({
          type: ActionType.PRIVATE_CHATS,
          payload: chats.privateChats,
        });
        dispatch({
          type: ActionType.GROUP_CHATS,
          payload: chats.groupChats,
        });
        dispatch({
          type: ActionType.BOT_CHATS,
          payload: chats.botChats,
        });

        dispatch({
          type: ActionType.CURRENT_CHAT,
          payload: chats.privateChats[0],
        });

        chats.groupChats.forEach((chat) => {
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

  const subscribeToGroup = async (stompClient: Client, groupId: string) => {
    stompClient.subscribe(
      "/group/" + groupId + "/queue/messages",
      (message) => onGroupMessageReceived(message, groupId),
      getAuthHeader()
    );
  };

  const onGroupMessageReceived = (
    messageObj: StompMessage,
    groupId: string
  ) => {
    const message = JSON.parse(messageObj.body) as Message;
    if (currentChat?.type == ChatType.GROUP && currentChat.id == groupId) {
      setMessages((messages) => [...messages, message]);
    } else {
      alert(groupId + " has a new message!");
    }
  };

  const onPrivateMessageReceived = async (
    chats: PrivateChat[],
    messageObj: StompMessage,
    currentChat: Chat
  ) => {
    const message = JSON.parse(messageObj.body) as Message;
    switch (message.type) {
      case MessageType.JOIN: {
        const groupId = message.content;
        const groupChat = await fetchChatById(groupId);
        subscribeToGroup(stompClientRef.current!, groupId);
        dispatch({ type: ActionType.ADD_GROUP_CHAT, payload: groupChat });
        break;
      }
      case MessageType.PRIVATE: {
        if (
          currentChat?.type == ChatType.PRIVATE &&
          currentChat.username == message.senderName
        ) {
          setMessages((messages) => [...messages, message]);
        } else {
          alert(message.senderName + " sent a new message!");

          if (!chats.some((chat) => chat.username == message.senderName)) {
            const privateChats = await fetchPrivateChats();
            const newPrivateChat = privateChats.find(
              (chat) => chat.username === message.senderName
            );
            dispatch({
              type: ActionType.ADD_PRIVATE_CHAT,
              payload: newPrivateChat!,
            });
          }
        }
        break;
      }
    }
  };

  const loadMessages = async () => {
    let endpoint;

    switch (currentChat?.type) {
      case ChatType.GROUP:
        endpoint = "groups/" + currentChat.name;
        break;
      case ChatType.PRIVATE:
        endpoint = currentChat.username;
        break;
      case ChatType.BOT:
        endpoint = currentChat.botName;
        break;
    }

    const messages = await fetchMessages(endpoint!);

    setMessages(messages);
  };

  useEffect(() => {
    if (!currentChat) return;
    currentChatRef.current = currentChat;
    loadMessages();
  }, [currentChat]);

  useEffect(() => {
    privateChatsRef.current = privateChats;
  }, [privateChats]);

  useEffect(() => {
    connectToWebsocket();
  }, []);

  const onMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    messageInput.current = e.target.value;
  };

  const handleSend = () => {
    let URL;
    if (!stompClientRef.current) return;
    switch (currentChat?.type) {
      case ChatType.BOT:
        URL = "/app/chat.sendToBot";
        stompClientRef.current.publish({
          destination: URL,
          body: JSON.stringify({
            content: messageInput.current,
            type: currentChat.type,
            receiverName: currentChat.botName,
          }),
          headers: getAuthHeader(),
        });
        break;
      case ChatType.GROUP:
        URL = "/app/chat.sendMessage";
        stompClientRef.current.publish({
          destination: URL,
          body: JSON.stringify({
            content: messageInput.current,
            type: currentChat.type,
            receiverName: currentChat.name,
          }),
          headers: getAuthHeader(),
        });
        break;
      case ChatType.PRIVATE:
        URL = "/app/chat.sendMessage";
        stompClientRef.current.publish({
          destination: URL,
          body: JSON.stringify({
            content: messageInput.current,
            type: currentChat.type,
            receiverName: currentChat.username,
          }),
          headers: getAuthHeader(),
        });
        break;
    }

    setMessages((messages: any) => [
      ...messages,
      {
        timestamp: Date.now(),
        content: messageInput.current,
        senderName: username,
      },
    ]);
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

  useEffect(() => {
    switch (currentChat?.type) {
      case ChatType.GROUP:
        setImageSrc(currentChat.image);
        setName(currentChat.name);
        break;
      case ChatType.PRIVATE:
        setImageSrc(currentChat.avatar);
        setName(currentChat.username);
        break;
      case ChatType.BOT:
        setImageSrc(currentChat.avatar);
        setName(currentChat.botName);
        break;
    }
  }, [currentChat]);

  return (
    <StyledChat
      $isFocused={panelMode === PanelMode.USER_CHATS && currentChat != null}
      onClick={onChatFocus}
    >
      {currentChat && (
        <StyledChatHeader>
          <StyledAvatar src={imageSrc} />
          <div>{name}</div>
        </StyledChatHeader>
      )}

      <section>
        {messages.map((messageObj: Message) => {
          return (
            <StyledMessage
              key={messageObj.senderName + messageObj.timestamp}
              $isSender={messageObj.senderName === username}
            >
              <div>{messageObj.content}</div>
            </StyledMessage>
          );
        })}
      </section>

      {currentChat && (
        <StyledSend>
          <input
            type="text"
            name="message"
            id="message"
            placeholder="message"
            onChange={onMessageChange}
            onKeyDown={handleKeyPress}
          />
        </StyledSend>
      )}
    </StyledChat>
  );
}
