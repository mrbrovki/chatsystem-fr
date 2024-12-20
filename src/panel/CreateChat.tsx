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
import {
  ActionType,
  ChatState,
  ChatType,
  PanelMode,
  PrivateChat,
} from "../context/types";
import { StyledControl, StyledHeader, StyledPanelButton } from "./Panel";
import { addNewFriend, getAllUsers } from "../utils/requests";
import styled from "styled-components";

const ChatOptions = styled.div`
  height: 4rem;
`;

const CreateChat = () => {
  const { dispatch } = useContext(Context);
  const [users, setUsers] = useState<PrivateChat[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PrivateChat[]>([]);

  const handleAddNewFriend = async (e: MouseEvent<HTMLButtonElement>) => {
    const newFriendId = e.currentTarget.getAttribute("data-id") as string;
    const newFriendName = e.currentTarget.getAttribute("data-name") as string;

    const avatar = (
      e.currentTarget.firstChild as HTMLInputElement
    ).getAttribute("src") as string;
    await addNewFriend(newFriendId);

    const newPrivateChat = {
      username: newFriendName,
      id: newFriendId,
      state: ChatState.NONE,
      unreadCount: 0,
      lastReadTime: 0,
      avatar: avatar,
      type: ChatType.PRIVATE,
    } as PrivateChat;

    dispatch({ type: ActionType.ADD_PRIVATE_CHAT, payload: newPrivateChat });
    dispatch({
      type: ActionType.CHAT_MESSAGES,
      payload: {
        chatMessages: [],
        chatId: newFriendId,
      },
    });

    dispatch({ type: ActionType.CURRENT_CHAT, payload: newPrivateChat });
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const switchToCreateGroup = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.CREATE_GROUP });
    dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
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
      <StyledHeader>
        <StyledControl>
          <StyledPanelButton
            type="submit"
            onClick={back}
            $color="#43A5DC"
            $hoverColor="#194b68"
          >
            back
          </StyledPanelButton>
          <StyledPanelButton
            onClick={switchToCreateGroup}
            $color="#000"
            $hoverColor="#194b68"
          >
            <img src="/group-icon.svg" width={30} height={30} />
            <span>Create Group</span>
          </StyledPanelButton>
        </StyledControl>
        <h1>New Chat</h1>
        <InputField
          type={"text"}
          id="add-new-friend"
          placeholder="search"
          name="newFriend"
          handleChange={handleChange}
          priority="secondary"
        />
        <ChatOptions></ChatOptions>
      </StyledHeader>

      <ChatList
        chats={filteredUsers}
        handleClick={handleAddNewFriend}
        isSelectMode={false}
      />
    </>
  );
};
export default CreateChat;
