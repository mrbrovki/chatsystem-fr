import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Context } from "../context";
import ChatList from "../chat/ChatList";
import InputField from "../components/InputField";
import { ActionType, ChatType, PanelMode, PrivateChat } from "../context/types";
import { StyledPanelButton } from "./Panel";
import { addNewFriend, getAllUsers } from "../utils/requests";

const CreateChat = () => {
  const { dispatch } = useContext(Context);
  const [users, setUsers] = useState<PrivateChat[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PrivateChat[]>([]);

  const handleAddNewFriend = async (e: MouseEvent<HTMLButtonElement>) => {
    const newFriendName = e.currentTarget.getAttribute("data-name") as string;
    const avatar = (
      e.currentTarget.firstChild as HTMLInputElement
    ).getAttribute("src") as string;
    await addNewFriend(newFriendName);

    const newPrivateChat = {
      username: newFriendName,
      avatar: avatar,
      type: ChatType.PRIVATE,
    } as PrivateChat;

    dispatch({ type: ActionType.ADD_PRIVATE_CHAT, payload: newPrivateChat });
    dispatch({
      type: ActionType.CHAT_MESSAGES,
      payload: {
        chatMessages: [],
        chatType: ChatType.PRIVATE,
        chatName: newFriendName,
      },
    });
    dispatch({ type: ActionType.CURRENT_CHAT, payload: newPrivateChat });
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const createGroup = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.CREATE_GROUP });
  };

  const back = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  useEffect(() => {
    (async () => {
      const allUsers = await getAllUsers();
      const privateChats = allUsers;
      setUsers(allUsers);
      setFilteredUsers(privateChats);
    })();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilteredUsers(() => {
      const value = e.target.value.toLowerCase();
      if (value) {
        return users.filter((privateChat) =>
          privateChat.username.toLowerCase().startsWith(value)
        );
      } else {
        return users;
      }
    });
  };

  return (
    <>
      <StyledPanelButton
        type="submit"
        onClick={back}
        $color="#43A5DC"
        $hoverColor="#194b68"
      >
        back
      </StyledPanelButton>
      <StyledPanelButton
        onClick={createGroup}
        $color="#000"
        $hoverColor="#194b68"
      >
        <img src="/group-icon.svg" width={30} height={30} />
        <span>Create Group</span>
      </StyledPanelButton>

      <InputField
        type={"text"}
        id="add-new-friend"
        placeholder="search"
        name="newFriend"
        handleChange={handleChange}
      />

      <ChatList
        chats={filteredUsers}
        handleClick={handleAddNewFriend}
        isSelectMode={false}
      />
    </>
  );
};
export default CreateChat;
