import { useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import InputField from "../auth/InputField";
import { getAuthHeader } from "../utils";
import { StyledPanelButton } from "./Panel";
import ChatList from "../ChatList";

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
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
  dispatch({type: "PANEL_MODE", payload: "USER_CHATS"});
  }

  const back = () => {
    dispatch({type: "PANEL_MODE", payload: "CREATE_CHAT"});
  }

 return(
  <>
    <StyledHeader>
      <StyledPanelButton type="submit" onClick={back} $color="#43A5DC" $hoverColor="#194b68">
        back
      </StyledPanelButton>
      <StyledPanelButton type="submit" onClick={submitGroup} $color="#43A5DC" $hoverColor="#194b68">create group</StyledPanelButton>
    </StyledHeader>

    <InputField type="text" label="group name" name="group-name"
    placeholder="Group name..." id="create-group-name"
    handleChange={handleChange} autoComplete="off"/>
  
    <ChatList chats={chats} handleClick={handleClick} />
  </>
 );
}
// <InputField type="text" label="Group name" id="group-name" placeholder="Group name" handleChange={handleChange} name="name" autoComplete="off"/>
export default CreateGroup;