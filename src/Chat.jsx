/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import UserChats from "./panel/UserChats";
import {fetchChats, getAuthHeader} from "./utils";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import OpenChat from "./OpenChat";
import { Context } from "./context";
import Panel from "./panel/Panel";


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


export default function Chat(){
  const {state: {username, currentChat, chats}, dispatch} = useContext(Context);

  const [messages, setMessages] = useState([]);

  const currentChatRef = useRef(null);
  const stompClientRef = useRef(null);

  const connectToWebsocket = () => {
    let socket = new SockJS("http://localhost:8080/ws");
    let stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("attempting connect!")
         stompClient.subscribe('/user/' + username + '/queue/messages', 
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
    console.log(chats)
    if(currentChatRef.current == message.senderName){
      setMessages(messages => [...messages, message]);
    }else{
      alert(message.senderName + " sent a new message!");
      if(!chats.some(chat=>{
        return chat.name === message.senderName;
      })){
        fetchChats().then(chats => {
          console.log(chats)
          dispatch({type: "CHATS", payload: chats});
        });
      }
    }
  }

  const fetchMessages = async () => {
     let messagesURL = "http://localhost:8080/api/v2/messages/";
    messagesURL += currentChat.type == "GROUP" ? "groups/"+currentChat.chat : currentChat.chat;
      const data = await(await fetch(messagesURL, {
        method: 'GET', 
        headers: {'Content-Type': 'application/json', 
        ...getAuthHeader()}})).json();
      currentChatRef.current = currentChat.chat;
      setMessages(data);
  }



 useEffect(()=>{
  if(!currentChat.chat) return;
  fetchMessages();
 }, [currentChat]);

 useEffect(()=>{
  connectToWebsocket();
 }, []);

 return(
  <>
    <StyledMain>
      <Sidebar />
      <Panel />
      <OpenChat stompClient={stompClientRef} messages={messages} setMessages={setMessages} />
    </StyledMain>
   </>
 );
}