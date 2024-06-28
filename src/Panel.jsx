import { useContext } from "react";
import UserChats from "./UserChats";
import CreateChat from "./CreateChat";
import EditProfile from "./EditProfile";
import styled from "styled-components";
import { Context } from "./context";

const StyledPanel = styled.div`
  background-color: #fff;
  flex: 3;
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