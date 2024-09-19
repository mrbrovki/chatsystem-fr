import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import InputField from "../components/InputField";
import { Context } from "../context";
import { fetchEditUser } from "../utils/utils";
import { StyledHeader } from "./CreateGroup";
import { ActionType, PanelMode } from "../context/types";
import { StyledButton, StyledForm } from "../App";
import { StyledPanelButton } from "./Panel";
import styled from "styled-components";

interface FormData {
  username: string;
  password: string;
  avatar: Blob | null;
}

const StyledImageUpload = styled.div`
  text-align: center;

  & input[type="file"] {
    display: none;
  }

  .personal-figure {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .personal-avatar {
    cursor: pointer;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    border-radius: 100%;
    border: 2px solid transparent;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    transition: all ease-in-out 0.3s;
  }
  .personal-avatar:hover {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  }

  .personal-figcaption {
    cursor: pointer;
    position: absolute;
    top: 0px;
    width: inherit;
    height: inherit;
    border-radius: 100%;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: all ease-in-out 0.3s;
  }

  .personal-figcaption:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .personal-figcaption > img {
    margin-top: 32.5px;
    width: 50px;
    height: 50px;
  }
`;

const EditProfile = () => {
  const {
    state: { username },
    dispatch,
  } = useContext(Context);
  const [formData, setFormData] = useState<FormData>({
    username,
    password: "",
    avatar: null,
  });

  const back = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (e.target.name == "avatar" && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [e.target.name]: file });
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const submitEdit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append(
      "json",
      JSON.stringify({
        username: formData.username,
        password: formData.password,
      })
    );
    if (formData.avatar) {
      fd.append("avatar", formData.avatar);
    }

    const response = await fetchEditUser(fd);

    dispatch({ type: ActionType.AVATAR, payload: response.avatar });
    dispatch({ type: ActionType.USERNAME, payload: response.username });
    back();
  };

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
        <StyledImageUpload className="personal-image">
          <label className="label">
            <input type="file" />
            <figure className="personal-figure">
              <img
                src="https://avatars1.githubusercontent.com/u/11435231?s=460&v=4"
                className="personal-avatar"
                alt="avatar"
              />
              <figcaption className="personal-figcaption">
                <img src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
              </figcaption>
            </figure>
          </label>
        </StyledImageUpload>

        <InputField
          type="file"
          label="avatar"
          id="edit-avatar"
          name="avatar"
          handleChange={handleChange}
        />
        <InputField
          type={"text"}
          label={"username"}
          id={"edit-username"}
          value={formData.username}
          name="username"
          handleChange={handleChange}
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
