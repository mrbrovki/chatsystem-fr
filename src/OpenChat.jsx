/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react'
import { getAuthHeader } from './utils';
import styled, { css } from 'styled-components';

const StyledChat = styled.div`
 flex: 8;
 

 & > section{
  gap: 10px;
  padding: 20px 16px 80px 16px;
  display: flex;
  flex-flow: column nowrap;
  overflow-y: scroll;
  height: calc(100% - 70px);
 }
 
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
 const messageInput = useRef(null);

 const onMessageChange = (e) => {
    messageInput.current = e.target.value;
  }

  const handleSend = () => {
    let URL;
    if(["Elon Musk", "Jeff Bezos", "Michael Jackson"].includes(props.currentChat.chat)){
      URL = "/app/chat.sendToBot"
    }else{
      URL = "/app/chat.sendMessage";
    }
    props.stompClient.current.publish({
      destination: URL,
      body: JSON.stringify({message: messageInput.current, type: props.currentChat.type, receiverName: props.currentChat.chat}),
      headers: getAuthHeader(),
    });
    
    props.setMessages(messages => [...messages, {
      message: messageInput.current, 
      timestamp: Date.now(), 
      senderName: props.username
    }]);
  }

  const handleKeyPress = (e) => {
    if(e.key == "Enter"){
      handleSend();
      e.currentTarget.value = "";
      
    }
  }
  console.log(props.messages)

  return (
    <StyledChat>
      <section>
        <div>{props.currentChat.chat}</div>

      {props.messages?.map((messageObj) => {
        return (
          <StyledMessage key={messageObj.senderName + messageObj.timestamp} $isSender={messageObj.senderName != props.currentChat.chat}>
            
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