import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context";
import {
  ActionType,
  Chat,
  ChatType,
  InfoMessage,
  Message,
  MessageType,
} from "../context/types";
import { updateReadStatus } from "../utils/requests";
import { padZero } from "../utils/utils";
import ReactPlayer from "react-player";
import styled, { css } from "styled-components";

const StyledMessage = styled.div<{ $isSender: boolean; $isText: boolean }>`
  max-width: 24rem;

  @media screen and (max-width: ${(props) => props.theme.breakpoints.lg}) {
    max-width: 20rem;
  }

  @media screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 18rem;
  }

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

const ChatContent: React.FC<{
  inputRef: RefObject<HTMLInputElement>;
  headerRef: RefObject<HTMLElement>;
}> = ({ inputRef, headerRef }) => {
  const {
    state: {
      currentChat,
      messages,
      privateChats,
      botChats,
      groupChats,
      infoMessages,
      username,
      userId,
    },
    dispatch,
  } = useContext(Context);
  const [content, setContent] = useState<any>([]);
  const scrollRef = useRef<HTMLElement>(null);

  const updateReadCount = (chats: Chat[], id: string, unreadCount: number) => {
    return chats.map((chat: any) => {
      if (chat.id === id) {
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
    if (!currentChat) return;
    let chatMessages: Message[] | InfoMessage[];

    switch (currentChat.type) {
      case ChatType.PRIVATE: {
        chatMessages = messages[currentChat.type][currentChat.id] as Message[];
        dispatch({
          type: ActionType.PRIVATE_CHATS,
          payload: updateReadCount(privateChats, currentChat.id, 0),
        });
        updateReadStatus(currentChat.type, currentChat.id);
        break;
      }
      case ChatType.GROUP: {
        chatMessages = messages[currentChat.type][currentChat.id] as Message[];
        dispatch({
          type: ActionType.GROUP_CHATS,
          payload: updateReadCount(groupChats, currentChat.id, 0),
        });

        updateReadStatus(currentChat.type, currentChat.id);
        break;
      }
      case ChatType.BOT: {
        chatMessages = messages[currentChat.type][currentChat.id] as Message[];
        dispatch({
          type: ActionType.BOT_CHATS,
          payload: updateReadCount(botChats, currentChat.botName, 0),
        });

        updateReadStatus(currentChat.type, currentChat.id);
        break;
      }
      case "info": {
        chatMessages = infoMessages[currentChat.id] as InfoMessage[];
      }
    }

    chatMessages = chatMessages ? chatMessages : [];

    const chatContent = chatMessages.map((chatMessage, index) => {
      const timestamp = chatMessage?.timestamp
        ? chatMessage.timestamp
        : Date.now();
      const date = new Date(timestamp);
      const senderId = chatMessage.senderId;
      const isSender = !senderId || senderId === userId;

      switch (chatMessage.type) {
        case MessageType.TEXT: {
          let messageContent: string = chatMessage.content;
          if (currentChat.type === ChatType.BOT) {
            messageContent = messageContent.replace(/{{user}}/g, username);
            messageContent = messageContent.replace(/\*.*\*/g, "");
          }

          return (
            <StyledMessage
              key={senderId + timestamp + index}
              $isText={true}
              $isSender={isSender}
            >
              <div className="content">
                {parseMessageContent(messageContent)}
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
          console.log(chatMessage);
          return (
            <StyledMessage
              key={senderId + timestamp + index}
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
              key={senderId + timestamp + index}
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
              key={senderId + chatMessage.timestamp}
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
                key={senderId + timestamp + index}
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
                key={senderId + timestamp + index}
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
  }, [currentChat, messages, userId]);

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

  return (
    <>
      <section ref={scrollRef}>{content}</section>
    </>
  );
};

export default ChatContent;
