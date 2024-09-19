import styled from "styled-components";
import ChatItem from "./ChatItem";
import { Chat, ChatType } from "../context/types";

const StyledChatList = styled.div`
  flex-grow: 1;
  position: relative;
  overflow-y: auto;
`;

const ChatList: React.FC<{ chats: Chat[]; handleClick: any }> = ({
  chats,
  handleClick,
}) => {
  return (
    <StyledChatList>
      {chats.map((chat) => {
        switch (chat.type) {
          case ChatType.GROUP:
            return (
              <ChatItem
                key={chat.id}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.id}
                data-id={chat.id}
                name={chat.name}
                image={chat.image}
              />
            );
          case ChatType.PRIVATE:
            return (
              <ChatItem
                key={chat.username}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.username}
                name={chat.username}
                image={chat.avatar}
              />
            );
          case ChatType.BOT:
            return (
              <ChatItem
                key={chat.botName}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.botName}
                name={chat.botName}
                image={chat.avatar}
              />
            );
        }
      })}
    </StyledChatList>
  );
};

export default ChatList;
