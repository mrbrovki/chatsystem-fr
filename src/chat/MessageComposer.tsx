import {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  useContext,
  useState,
} from "react";
import { Context } from "../context";
import { ActionType, Chat, ChatType, MessageType } from "../context/types";
import { saveFile } from "../utils/utils";
import { Client } from "@stomp/stompjs";
import styled from "styled-components";
import { sendFile } from "../utils/stompUtils";

const StyledSend = styled.div`
  height: 70px;
  background-color: #ffffff;
  border-radius: 12px 12px 20px 20px;
  padding: 0 16px 0;
  position: relative;

  & > div {
    background-color: #f7f7f7;
    padding: 0 16px;
    height: 48px;
    width: 100%;
    border: none;
    box-shadow: 0 0 8px #00000026;
    border-radius: 12px;
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
  }

  & input {
    width: 100%;
    outline: none;
    border: none;
    background-color: #0000;
    box-shadow: none;
    padding: 0;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    @media only screen and (max-width: ${(props) =>
        props.theme.breakpoints.md}) {
      font-size: 1rem;
    }

    &::placeholder {
      color: #00000058;
    }
  }

  img {
    fill: black;
    display: block;
    &:hover {
      cursor: pointer;
    }
  }

  input[type="file"] {
    display: none;
  }
`;
type PropsType = {
  stompClientRef: MutableRefObject<Client>;
};

const MessageComposer = forwardRef<HTMLInputElement, PropsType>(
  (_props, ref) => {
    const stompClientRef = _props.stompClientRef;
    const {
      state: { userId, currentChat },
      dispatch,
    } = useContext(Context);
    const [value, setValue] = useState("");

    const handleSend = async () => {
      if (!stompClientRef || !currentChat) return;
      let url: string;

      const message = {
        type: MessageType.TEXT,
        timestamp: Date.now(),
        content: value,
        senderId: userId,
      };

      switch (currentChat.type) {
        case ChatType.BOT:
          url = "/app/chat.sendToBot";
          stompClientRef.current.publish({
            destination: url,
            body: JSON.stringify({
              content: message.content,
              type: message.type,
              receiverId: currentChat.id,
            }),
          });
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: currentChat.type,
              chatId: currentChat.id,
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
              receiverId: currentChat.id,
            }),
          });
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: {
              chatType: currentChat.type,
              chatId: currentChat.id,
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
              receiverId: currentChat.id,
            }),
          });
          if (currentChat.id !== userId) {
            dispatch({
              type: ActionType.ADD_MESSAGE,
              payload: {
                chatType: currentChat.type,
                chatId: currentChat.id,
                message: message,
              },
            });
          }

          break;
        }
      }
      setValue("");
    };

    const onMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    const handleKeyPress = (e: any) => {
      if (e.key == "Enter") {
        handleSend();
        e.currentTarget.value = "";
      }
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (!currentChat) return;

      const files = e.target.files as FileList;
      const receiverId = currentChat.id;
      for (const file of files) {
        sendFile(file, currentChat as Chat, receiverId, stompClientRef.current);
        saveFile(
          dispatch,
          file,
          userId,
          currentChat.type as ChatType,
          receiverId
        );
      }
    };

    return (
      <StyledSend>
        <div>
          <input
            type="text"
            name="message"
            id="message"
            placeholder="message or drag file"
            onChange={onMessageChange}
            onKeyDown={handleKeyPress}
            value={value}
            ref={ref}
          />
          <label>
            <input type="file" onChange={handleUpload} multiple />
            <img src="./file-upload-icon.svg" width={28} />
          </label>
          <img
            onClick={handleSend}
            src="./send-message-icon.svg"
            width={32}
            height={32}
          />
        </div>
      </StyledSend>
    );
  }
);

export default MessageComposer;
