import { useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "./context";

export const StyledAvatar = styled.img`
  box-shadow: 0 0 2px #00000072;
  border-radius: 48px;
  float: left;
  height: 48px;
  width: 48px;
`;

const Overlay = styled.div`
  background-color: #393939e8;
  height: 48px;
  width: 48px;
  border-radius: 48px;
  position: absolute;
  overflow-y: hidden;
`;

const StyledChatItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  padding: 8px;
 
  &:hover{
    box-shadow: 0 0 2px #0000002e;
    border-radius: 20px;
    cursor: pointer;
}`;

export default function ChatItem(props){
  const {state: {panelMode}} = useContext(Context);
  const [isSelected, setIsSelected] = useState(false);
  const {chat, handleClick, ...restProps } = props;

  const defaultURL = `https://api.multiavatar.com/${chat.name}.svg`;
  const avatarURL = chat.avatar || defaultURL;
  

  const toggleSelect = (e) => {
    handleClick(e);
    setIsSelected(prev => !prev);
  }
  
  const children = (<>
    <StyledAvatar src={`${avatarURL}?apiKey=${process.env.AVATAR_API}`} />
    <div>{chat.name}</div>
  </>); 



  switch(panelMode){
    case "CREATE_GROUP":
      return(
        <StyledChatItem {...restProps} onClick={toggleSelect}>
         {isSelected || <Overlay />}
         {children}
        </StyledChatItem>);
    case "USER_CHATS":
      return(
        <StyledChatItem {...restProps} onClick={toggleSelect}>
         {children}
        </StyledChatItem>);
    case "CREATE_CHAT":
      return(
        <StyledChatItem {...restProps} onClick={handleClick}>
         {children}
        </StyledChatItem>); 
    default: 
      return (
        <StyledChatItem {...restProps}>
         {children}
        </StyledChatItem>);
  }
}