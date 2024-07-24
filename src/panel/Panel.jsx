import { useContext } from "react";
import UserChats from "./UserChats";
import CreateChat from "./CreateChat";
import EditProfile from "./EditProfile";
import styled, { css } from "styled-components";
import { Context } from "../context";
import CreateGroup from "./CreateGroup";

const StyledPanel = styled.div`
  background-color: #fff;
  padding: 2rem;
  flex: 3;
`;

export const StyledPanelButton = styled.button`
  background: transparent; 
  border: none; 
  cursor: pointer;
  color: ${props => props.$color};
  font-size: 1rem;
  display: block;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  
  &:hover{
    color: #2c6c90;
  }
`;

const Panel = () => {
 const {state: {panelMode}} = useContext(Context);
 let panel;
 
 switch(panelMode){
  case "USER_CHATS":
   panel = <UserChats />
   break;
  case "CREATE_CHAT":
   panel = <CreateChat />
   break;
  case "EDIT_PROFILE":
   panel = <EditProfile />
   break;
   case "CREATE_GROUP":
    panel = <CreateGroup />
    break;
   default: 
   panel = <UserChats />
   break;
 }
 return(
  <StyledPanel>
   {panel}
  </StyledPanel>
 );
}

export default Panel;