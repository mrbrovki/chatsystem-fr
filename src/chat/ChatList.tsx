import styled from "styled-components";
import ChatItem from "./ChatItem";
import { Chat, ChatType, InfoChat } from "../context/types";

const StyledChatList = styled.div`
  flex-grow: 1;
  position: relative;
  overflow-y: auto;
`;

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
                chatState={chat.state}
                name={chat.name}
                image={chat.image || "/group-icon.svg"}
                unreadCount={chat.unreadCount}
                type={chat.type}
                isSelectMode={isSelectMode}
                data-state={chat.state}
                data-type={chat.type}
                data-name={chat.name}
                data-id={chat.id}
                data-image={chat.image || "/group-icon.svg"}
                id={chat.id}
              />
            );
          case ChatType.PRIVATE:
            return (
              <ChatItem
                key={chat.id}
                handleClick={handleClick}
                name={chat.username}
                image={chat.avatar || "/user-icon.svg"}
                data-image={chat.avatar || "/user-icon.svg"}
                type={chat.type}
                unreadCount={chat.unreadCount}
                isSelectMode={isSelectMode}
                chatState={chat.state}
                data-state={chat.state}
                data-type={chat.type}
                data-name={chat.username}
                data-id={chat.id}
                id={chat.id}
              />
            );
          case ChatType.BOT:
            return (
              <ChatItem
                key={chat.id}
                handleClick={handleClick}
                name={chat.botName}
                image={chat.avatar || "/user-icon.svg"}
                unreadCount={chat.unreadCount}
                isSelectMode={isSelectMode}
                type={chat.type}
                chatState={chat.state}
                data-state={chat.state}
                data-type={chat.type}
                data-name={chat.botName + " 🤖"}
                data-id={chat.id}
                data-image={chat.avatar || "/user-icon.svg"}
                id={chat.id}
              />
            );
          case "info":
            return (
              <ChatItem
                key={chat.name}
                handleClick={handleClick}
                data-type={chat.type}
                data-name={chat.name}
                type={"info"}
                name={chat.name}
                image={chat.image || `/${chat.name}-icon.svg`}
                unreadCount={chat.unreadCount}
                data-state={chat.state}
                chatState={chat.state}
                data-id={chat.name}
                data-image={chat.image || `/${chat.name}-icon.svg`}
                id={chat.id}
              />
            );
        }
      })}
    </StyledChatList>
  );
};

export default ChatList;
