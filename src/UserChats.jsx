/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import {getAuthHeader, fetchChats} from "./utils";
import styled from "styled-components";
import ChatItem from "./ChatItem";
import { Context } from "./context";

const StyledUserChats = styled.div`
  padding: 20px;

  & > h1{
    font-weight: 700;
    float: left;
  }
  & > img{
    float: right;
  }
`;

const StyledChats = styled.div`
  & > div{
    clear: both;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    padding: 10px 0;

    &:hover{
      box-shadow: 0 0 2px #0000002e;
      border-radius: 20px;
      cursor: pointer;
    }
  }
`;

export default function UserChats(){
 const {state: {chats}, dispatch} = useContext(Context);

 const onChatClick = (e) => {
  if(e.currentTarget.getAttribute("data-type") == "GROUP"){
    dispatch({type: "CURRENT_CHAT", payload: {chat: e.currentTarget.getAttribute("data-id"), type: "GROUP"}});
  }else{
    dispatch({type: "CURRENT_CHAT", payload: {chat: e.currentTarget.textContent, type: "PRIVATE"}});
  }
 }

 useEffect(()=>{
  (async () => {
    let chats = await fetchChats();
    dispatch({type: "CHATS", payload: chats});
  })();
 }, []);


 const switchToCreateMode = () => {
  dispatch({type: "PANEL_MODE", payload: "CREATE_CHAT"});
 }

 
 return(
  <StyledUserChats>
  <h1>Chat</h1>
  <img src="./public/edit-icon.svg" width={30} height={30} onClick={switchToCreateMode}/>
    <StyledChats>
      {chats.map(chat => { 
    return(
      <div key={chat.name} onClick={onChatClick} 
        data-type={chat.type} 
        data-id={chat.id}>
         <ChatItem chat={chat}/>
      </div>)})}
    </StyledChats>
  </StyledUserChats>
);
}