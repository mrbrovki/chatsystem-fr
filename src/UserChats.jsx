/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {getAuthHeader} from "./utils";
import styled from "styled-components";
import ChatItem from "./ChatItem";

const StyledUserChats = styled.div`
  background-color: #fff;
  flex: 3;
  
  & > div{
    padding: 10px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;

    &:hover{
      box-shadow: 0 0 2px #0000002e;
      border-radius: 20px;
      cursor: pointer;
    }
  }

`;



export default function UserChats(props){
 const [chats, setChats] = useState([]);
 

 const onChatClick = (e) => {
  if(e.currentTarget.getAttribute("data-type") == "GROUP"){
    props.setCurrentChat({chat: e.currentTarget.getAttribute("data-id"), type: "GROUP"});
  }else{
    props.setCurrentChat({chat: e.currentTarget.textContent, type: "PRIVATE"});
  }
 }

 useEffect(() => {(async function(){
  const CHATS_URL = "http://localhost:8080/api/v3/chats";
   const response = await fetch(CHATS_URL, 
    {method: 'GET', headers:  getAuthHeader()});
   const chats = await response.json();
   setChats(chats);
 })()}, []);


 return(<StyledUserChats>
   {chats.map(chat => { 
    return(
      <div key={chat.name} onClick={onChatClick} 
        data-type={chat.type} 
        data-id={chat.id}>
         <ChatItem chat={chat}/>
      </div>)})}
 </StyledUserChats>);
}