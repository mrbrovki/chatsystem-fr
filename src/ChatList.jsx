import styled from "styled-components";
import ChatItem from "./ChatItem";

const StyledChatList = styled.div`
flex-grow: 1;
position: relative;
overflow-y: auto;
`;

const ChatList = ({chats, handleClick}) => {

 return(
 <StyledChatList>
      {chats.map(chat => { 
    return(
         <ChatItem key={chat.name} handleClick={handleClick} 
        data-type={chat.type} 
        data-name={chat.name}
        data-id={chat.id} chat={chat}/>)})}
  </StyledChatList>
 );
}

export default ChatList;