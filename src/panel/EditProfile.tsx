import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import InputField from "../components/InputField";
import { Context } from "../context";
import { fetchEditUser } from "../utils/utils";
import { StyledHeader } from "./CreateGroup";
import { ActionType, PanelMode } from "../context/types";
import { StyledButton, StyledForm } from "../App";
import { StyledPanelButton } from "./Panel";
import AvatarUpload from "../components/AvatarUpload";
import { useUsernameExists } from "../hooks/useUsernameExists";

interface FormData {
  username: string;
  password: string;
  avatar: Blob | null;
}

const EditProfile = () => {
  const {
    state: { username, avatar },
    dispatch,
  } = useContext(Context);

  const [newUsername, setNewUsername] = useState(username);

  const [formData, setFormData] = useState<FormData>({
    username,
    password: "",
    avatar: null,
  });

  const { isAvailable } = useUsernameExists(newUsername, username);

  const [currentSrc, setCurrentSrc] = useState(
    avatar || "./public/user-icon.svg"
  );

  const back = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(e.target);
    if (e.target.name == "avatar" && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [e.target.name]: file });
        setCurrentSrc(URL.createObjectURL(file));
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewUsername(value);
  };

  const submitEdit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append(
      "json",
      JSON.stringify({
        username: newUsername,
        password: formData.password,
      })
    );

    fd.append("avatar", formData.avatar || new Blob());

    back();
    dispatch({ type: ActionType.AVATAR, payload: "./public/user-icon.svg" });
    const { accessToken, username, avatar } = await fetchEditUser(fd);

    sessionStorage.setItem("jwt", accessToken);
    dispatch({ type: ActionType.USERNAME, payload: username });

    if (avatar) {
      dispatch({
        type: ActionType.AVATAR,
        payload: `${avatar}?timestamp=${Date.now()}`,
      });
    }
  };

  useEffect(() => {
    if (!avatar) return;
    setCurrentSrc(avatar);
  }, [avatar]);

  return (
    <>
      <StyledHeader>
        <StyledPanelButton
          onClick={back}
          $color="#43A5DC"
          $hoverColor="#194b68"
        >
          back
        </StyledPanelButton>
      </StyledHeader>
      <StyledForm>
        <AvatarUpload
          htmlFor="edit-avatar"
          name="avatar"
          id="edit-avatar"
          currentSrc={currentSrc}
          handleChange={handleChange}
        />
        <InputField
          type={"text"}
          label={"username"}
          id={"edit-username"}
          value={newUsername}
          name="username"
          handleChange={handleUsernameChange}
          isError={!isAvailable}
          errorContent="username already exists"
        />
        <InputField
          type={"text"}
          label={"password"}
          id={"edit-password"}
          name="password"
          handleChange={handleChange}
          placeholder="enter new password"
        />
        <StyledButton type="submit" onClick={submitEdit} $isDark>
          save changes
        </StyledButton>
      </StyledForm>
    </>
  );
};
export default EditProfile;
