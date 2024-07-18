import { useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "./context";

const StyledAvatar = styled.img`
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
`;

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
        <div {...restProps} onClick={toggleSelect}>
         {isSelected || <Overlay />}
         {children}
        </div>);
    case "USER_CHATS":
      return(
        <div {...restProps} onClick={toggleSelect}>
         {children}
        </div>); 
    default: 
      return (
        <div {...restProps}>
         {children}
        </div>);
  }
}