/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useRef } from 'react'
import { getAuthHeader } from './utils';
import styled, { css } from 'styled-components';
import ChatItem, { StyledAvatar } from './ChatItem';
import { Context } from './context';

const StyledChat = styled.div`
 flex: ${props => props.$isFocused? 8 : 4};
 opacity: ${props => props.$isFocused? 1 : 0.3};
 transition: all 0.3s;
  position: relative;

 & > section{
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
    border-radius: var(--components-border-radius) var(--components-border-radius) 0 0;
    background-color: #ffffff;
    border-bottom: solid 1px #e1e1e1;
`;

const StyledMessage = styled.div`
max-width: 320px;
border-radius: 20px;
padding: 16px;
box-shadow: 0 0 8px #00000026;

  ${props => {
    if(props.$isSender){
      return(css`
        background-color: #43A5DC;
        color: #fff;
        align-self: flex-end;

      `);
    }else{
      return(css`
        background-color: #D9D9D9;
        align-self: flex-start;
      `);
    }
  }}
`;

const StyledSend = styled.div`
  height: 70px;
  background-color: #ffffff;
  border-radius: 12px 12px 20px 20px;
  padding: 0 16px 0;

  & > input{
    background-color: #F7F7F7;
    padding: 0 16px;
    height: 48px;
    width: 100%;
    border: none;
    box-shadow: 0 0 8px #00000026;
    border-radius: 12px;
  }
  & > input:focus{
    outline: none;
  }
`;

export default function OpenChat(props) {
  const {state: {username, currentChat, panelMode}, dispatch} = useContext(Context);
 const messageInput = useRef(null);

 const onMessageChange = (e) => {
    messageInput.current = e.target.value;
  }

  const handleSend = () => {
    let URL;
    if(["Elon Musk", "Jeff Bezos", "Michael Jackson"].includes(currentChat.name)){
      URL = "/app/chat.sendToBot"
    }else{
      URL = "/app/chat.sendMessage";
    }
    props.stompClient.current.publish({
      destination: URL,
      body: JSON.stringify({message: messageInput.current, type: currentChat.type, receiverName: currentChat.name}),
      headers: getAuthHeader(),
    });
    
    props.setMessages(messages => [...messages, {
      message: messageInput.current, 
      timestamp: Date.now(), 
      senderName: username
    }]);
  }

  const handleKeyPress = (e) => {
    if(e.key == "Enter"){
      handleSend();
      e.currentTarget.value = "";
      
    }
  }

  const onChatFocus = () => {
    dispatch({type: "PANEL_MODE", payload: "USER_CHATS"});
  }

  const defaultURL = `https://api.multiavatar.com/${currentChat.name}.svg`;
  const avatarURL = currentChat.avatar || defaultURL;

  return (
    <StyledChat $isFocused={panelMode === "USER_CHATS"} onClick={onChatFocus}>
      <StyledChatHeader>
          <StyledAvatar src={`${avatarURL}?apiKey=${process.env.AVATAR_API}`} />
          <div>{currentChat.name}</div>
      </StyledChatHeader>

      <section>
    
      {props.messages?.map((messageObj) => {
        return (
          <StyledMessage key={messageObj.senderName + messageObj.timestamp} $isSender={messageObj.senderName != currentChat.name}>
            
            <div>{messageObj.message}</div>
          </StyledMessage>);
      })}
      </section>


      <StyledSend>
        <input type="text" name="message" id="message" placeholder="message" 
        onChange={onMessageChange} onKeyDown={handleKeyPress}/>
      </StyledSend>
    </ StyledChat>
  )
}