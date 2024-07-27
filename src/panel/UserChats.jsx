/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import {fetchChats} from "../utils";
import styled from "styled-components";
import ChatItem from "../ChatItem";
import { Context } from "../context";
import ChatList from "../ChatList";

const StyledHeader = styled.header`
  & > h1{
    font-weight: 700;
    float: left;
  }
  & > img{
    float: right;
  }
`;

export default function UserChats(){
 const {state: {chats}, dispatch} = useContext(Context);

 const handleClick = (e) => {
  if(e.currentTarget.getAttribute("data-type") == "GROUP"){
    dispatch({type: "CURRENT_CHAT", payload: {name: e.currentTarget.getAttribute("data-id"), type: "GROUP"}});
  }else{
    dispatch({type: "CURRENT_CHAT", payload: {name: e.currentTarget.textContent, type: "PRIVATE"}});
  }
 }

 useEffect(()=>{
  (async () => {
    let chats = await fetchChats();
    dispatch({type: "CHATS", payload: chats});
    dispatch({type: "CURRENT_CHAT", payload: chats[0]})
  })();
 }, []);


 const switchToCreateMode = () => {
  dispatch({type: "PANEL_MODE", payload: "CREATE_CHAT"});
 }
 
 return(
  <>
  <StyledHeader>
    <h1>Chat</h1>
    <img src="./public/edit-icon.svg" width={30} height={30} onClick={switchToCreateMode}/>
  </StyledHeader>
  <ChatList chats={chats} handleClick={handleClick}/>
  </>
);
}