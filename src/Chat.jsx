/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import UserChats from "./UserChats";
import {getAuthHeader} from "./utils";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import Sidebar from "./Sidebar";
import OpenChat from "./OpenChat";

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  body,
  html,
  * {
    margin: 0;
    padding: 0;
  }
`;

const StyledMain = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #D9D9D9;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 1rem;
  justify-content: space-between;
  gap: 20px;

  & > *{
    height: 95%;
    border-radius: 20px;
    background-color: #fff;
  }
`;  


export default function Chat(props){
  //const [user, setUser] = useState({username: "", avatar: ""});
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState({chat: "", type: ""});

  const currentChatRef = useRef(null);
  const stompClientRef = useRef(null);

  const connectToWebsocket = () => {
    let socket = new SockJS("http://localhost:8080/ws");
    let stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("attempting connect!")
         stompClient.subscribe('/user/' + props.username + '/queue/messages', 
          onPrivateMessageReceived, getAuthHeader());
         subscribeToGroups();
        },
        reconnectDelay: 200,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
      stompClient.activate();

    stompClientRef.current = stompClient;
  }
  
  const subscribeToGroups = async () => {
    const URL = "http://localhost:8080/api/v3/chats";
    let response = await fetch(URL, {method: 'GET', headers: {
      'Content-Type': 'application/json', 
      ...getAuthHeader(),
    }});
    let chats = await response.json();
    console.log(chats)
    chats.forEach(chat => {
      let type = chat.type;
      if(type == "GROUP"){
          let id = chat.id;
          stompClientRef.current.subscribe('/group/' + id + '/queue/messages', 
          message=>onGroupMessageReceived(message,id), getAuthHeader());
      }
    });
  }

  const onGroupMessageReceived = (messageObj,groupId) => {
    const message = JSON.parse(messageObj.body);
    if(currentChatRef.current == groupId){
      setMessages(messages => [...messages, message]);
    }else{
      alert(groupId + " has a new message!");
    }
  }

  const onPrivateMessageReceived = (messageObj) => {
    const message = JSON.parse(messageObj.body);
    console.log(currentChatRef.current)
    if(currentChatRef.current == message.senderName){
      setMessages(messages => [...messages, message]);
    }else{
      alert(message.senderName + " sent a new message!");
    }
  }



 useEffect(()=>{
  (async () => {
    if(currentChat == null) return; 
    let messagesURL = "http://localhost:8080/api/v2/messages/";
    messagesURL += currentChat.type == "GROUP" ? "groups/"+currentChat.chat : currentChat.chat;
      const data = await(await fetch(messagesURL, {
        method: 'GET', 
        headers: {'Content-Type': 'application/json', 
        ...getAuthHeader()}})).json();
      setMessages(data);
      currentChatRef.current = currentChat.chat;
  })();
 }, [currentChat]);

 useEffect(()=>{
  connectToWebsocket();
 }, []);

 console.log("chat rendered")
 return(
  <>
    <GlobalStyles />
    <StyledMain>
      <Sidebar setUsername={props.setUsername} username={props.username}/>
      <UserChats setCurrentChat={setCurrentChat}/>
      <OpenChat stompClient={stompClientRef} currentChat={currentChat} messages={messages} setMessages={setMessages} username={props.username}/>
    </StyledMain>
   </>
 );
}