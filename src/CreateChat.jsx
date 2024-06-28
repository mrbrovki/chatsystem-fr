import { useContext, useRef } from "react";
import { Context } from "./context";
import { fetchChats, getAuthHeader } from "./utils";

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

 return(<>
      <span>
      <input type="text" placeholder="enter user here" id="add-new-friend" name="newFriend" ref={newUserRef}/>
      <button onClick={addNewFriend}>add new friend</button>
    </span>

 </>);
}
export default CreateChat;