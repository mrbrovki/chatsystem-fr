import styled from "styled-components";
import ChatItem from "./ChatItem";
import { Chat, ChatType, InfoChat } from "../context/types";

const StyledChatList = styled.div`
  flex-grow: 1;
  position: relative;
  overflow-y: auto;
`;

const truncateStr = (str: string) => {
  if (str.length > 16) {
    return str.substring(0, 16) + "...";
  }
  return str;
};

const ChatList: React.FC<{
  chats: (Chat | InfoChat)[];
  handleClick: any;
  isSelectMode: boolean;
}> = ({ chats, handleClick, isSelectMode }) => {
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
                name={truncateStr(chat.name)}
                image={chat.image || "/group-icon.svg"}
                unreadCount={chat.unreadCount}
                isSelectMode={isSelectMode}
              />
            );
          case ChatType.PRIVATE:
            return (
              <ChatItem
                key={chat.username}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.username}
                name={truncateStr(chat.username)}
                image={chat.avatar || "/user-icon.svg"}
                unreadCount={chat.unreadCount}
                isSelectMode={isSelectMode}
              />
            );
          case ChatType.BOT:
            return (
              <ChatItem
                key={chat.botName}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.botName}
                name={truncateStr(chat.botName) + " 🤖"}
                image={chat.avatar || "/user-icon.svg"}
                unreadCount={chat.unreadCount}
                isSelectMode={isSelectMode}
              />
            );
          case "info":
            return (
              <ChatItem
                key={chat.name}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.name}
                name={truncateStr(chat.name)}
                image={chat.image || `/${chat.name}-icon.svg`}
                unreadCount={chat.unreadCount}
              />
            );
        }
      })}
    </StyledChatList>
  );
};

export default ChatList;
