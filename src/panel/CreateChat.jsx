import { useContext, useRef, useState } from "react";
import { Context } from "../context";
import { fetchChats, getAuthHeader } from "../utils";
import { StyledPanelButton } from "./Panel";

const CreateChat = () => {
 const {dispatch} = useContext(Context);
 

 const newUserRef = useRef(null);

 const addNewFriend = async () => {
  const URL = "http://localhost:8080/api/v3/chats/private/add";
  const response = await fetch(URL, {
    method: "PUT",
    headers: {...getAuthHeader(), 'Content-Type': 'application/json',},
    body: JSON.stringify({username: newUserRef.current.value})
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

 return(<>
      <StyledPanelButton type="submit" onClick={back} $color="#43A5DC" $hoverColor="#194b68">
        back
      </StyledPanelButton>
      <StyledPanelButton onClick={createGroup} $color="#000" $hoverColor="#194b68">
        <img src="./public/group-icon.svg" width={30} height={30} />
        <span>Create Group</span>
      </StyledPanelButton>

      <input type="text" placeholder="enter user here" id="add-new-friend" name="newFriend" ref={newUserRef}/>
      <button onClick={addNewFriend}>add new friend</button>
 </>);
}
export default CreateChat;