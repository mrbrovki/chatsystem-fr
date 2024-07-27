import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import { fetchChats, getAuthHeader } from "../utils";
import { StyledPanelButton } from "./Panel";
import ChatList from "../ChatList";
import styled from "styled-components";


const CreateChat = () => {
  const {dispatch} = useContext(Context);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);


  const addNewFriend = async (e) => {
  const URL = "http://localhost:8080/api/v3/chats/private/add";
  const response = await fetch(URL, {
    method: "PUT",
    headers: {...getAuthHeader(), 'Content-Type': 'application/json'},
    body: JSON.stringify({username: e.currentTarget.getAttribute("data-name")}),
  });
  let chats = await fetchChats();
  dispatch({type: "CHATS", payload: chats});
  dispatch({type: "PANEL_MODE", payload: "USER_CHATS"});
  }

  const createGroup = () => {
    dispatch({type: "PANEL_MODE", payload: "CREATE_GROUP"});
  }

  const back = () => {
    dispatch({type: "PANEL_MODE", payload: "USER_CHATS"});
  }

  useEffect(() => {
    (async()=>{
      const ALL_USERS_URL = "http://localhost:8080/api/v2/users/all";
      const response = await fetch(ALL_USERS_URL, {
        method: "GET",
        headers: getAuthHeader(),
      });

      const json = await response.json();
      const users = json.map((user)=>({name: user.username, avatar: user.avatar}))
      setAllUsers(users);
      setFilteredUsers(users);
    })();
  }, []);


  const handleInputChange = (e) => {
    setFilteredUsers(()=>{
      const value = e.target.value.toLowerCase();
      if(value){
        console.log(value)
        return allUsers.filter(user => user.username.toLowerCase().startsWith(value));
      }else{
        return allUsers;
      }
    });
  }
  
  return(<>
      <StyledPanelButton type="submit" onClick={back} $color="#43A5DC" $hoverColor="#194b68">
        back
      </StyledPanelButton>
      <StyledPanelButton onClick={createGroup} $color="#000" $hoverColor="#194b68">
        <img src="./public/group-icon.svg" width={30} height={30} />
        <span>Create Group</span>
      </StyledPanelButton>

      <input type="text" placeholder="enter user here" id="add-new-friend" name="newFriend" onChange={handleInputChange}/>

      <ChatList chats={filteredUsers} handleClick={addNewFriend}/>
 </>);
}
export default CreateChat;