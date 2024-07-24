import { useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import ChatItem from "../ChatItem";
import InputField from "../auth/InputField";
import { getAuthHeader } from "../utils";
import { StyledPanelButton } from "./Panel";

const StyledUserChats = styled.div`
  & > h1{
    font-weight: 700;
    float: left;
  }
  & > img{
    float: right;
  }

  div{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
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
  }
`;


const CreateGroup = () => {
 const [groupData, setGroupData] = useState({name: "", memberNames: []});
 const {state: {chats}, dispatch} = useContext(Context);

 const handleChange = (e) => {
  const { value } = e.target;
  setGroupData(groupData => ({ ...groupData, name: value }));
};
  const handleClick = (e) =>{
    const currentUser = e.currentTarget.getAttribute("data-name");
    setGroupData(groupData => {
      if(groupData.memberNames.includes(currentUser)){
        return {...groupData, 
          memberNames: groupData.memberNames.filter((username => username != currentUser))}
      }else{
        return {...groupData, memberNames: [...groupData.memberNames, currentUser]}
      }
    });
  }

  const submitGroup = async (e) => {
    e.preventDefault();
    console.log(groupData);
    const URL = 'http://localhost:8080/api/v3/chats/groups';
    let response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
        },
        body: JSON.stringify(groupData)
    });

  let groupChat = await response.json();
  console.log(groupChat);  
  }

  const back = () => {
    dispatch({type: "PANEL_MODE", payload: "CREATE_CHAT"});
  }

 return(
  <>
    <StyledUserChats>
      <div>
        <StyledPanelButton type="submit" onClick={back} $color="#43A5DC" $hoverColor="#194b68">
        back
      </StyledPanelButton>
      <StyledPanelButton type="submit" onClick={submitGroup} $color="#43A5DC" $hoverColor="#194b68">create group</StyledPanelButton>
      </div>
      <InputField type="text" label="group name" name="group-name"
    placeholder="Group name..." id="create-group-name"
    handleChange={handleChange} autoComplete="off"/>
  
    <StyledChats>
      {chats.map(chat => { 
    return(
         <ChatItem chat={chat} key={chat.name}
        data-type={chat.type} 
        data-id={chat.id}
        data-name={chat.name} handleClick={handleClick}/>
      )})}
    </StyledChats>
  </StyledUserChats>
  </>
 );
}
// <InputField type="text" label="Group name" id="group-name" placeholder="Group name" handleChange={handleChange} name="name" autoComplete="off"/>
export default CreateGroup;