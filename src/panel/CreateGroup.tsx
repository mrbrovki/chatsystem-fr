import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import InputField from "../components/InputField";
import { fetchCreateGroup } from "../utils/utils";
import ChatList from "../chat/ChatList";
import { ActionType, PanelMode } from "../context/types";
import { StyledPanelButton } from "./Panel";

export const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

interface FormData {
  name: string;
  memberNames: string[];
  image: Blob | null;
}

const CreateGroup = () => {
  const {
    state: { privateChats },
    dispatch,
  } = useContext(Context);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    memberNames: [],
    image: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (e.target.name == "image" && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [e.target.name]: file });
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const currentUser = e.currentTarget.getAttribute("data-name")!;
    setFormData((groupData) => {
      if (groupData.memberNames.includes(currentUser)) {
        return {
          ...groupData,
          memberNames: groupData.memberNames.filter(
            (username) => username != currentUser
          ),
        };
      } else {
        return {
          ...groupData,
          memberNames: [...groupData.memberNames, currentUser],
        };
      }
    });
  };

  const submitGroup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append(
      "json",
      JSON.stringify({
        name: formData.name,
        memberNames: formData.memberNames,
      })
    );
    if (formData.image) {
      fd.append("image", formData.image);
    }
    const response = await fetchCreateGroup(fd);

    await response.json();
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const back = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.CREATE_CHAT });
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
        <StyledPanelButton
          type="submit"
          onClick={submitGroup}
          $color="#43A5DC"
          $hoverColor="#194b68"
        >
          create group
        </StyledPanelButton>
      </StyledHeader>

      <InputField
        type="file"
        label="image"
        id="create-group-image"
        name="image"
        handleChange={handleChange}
      />

      <InputField
        type="text"
        label="name"
        name="name"
        placeholder="Group name..."
        id="create-group-name"
        handleChange={handleChange}
        autoComplete="off"
      />

      <ChatList chats={privateChats} handleClick={handleClick} />
    </>
  );
};
export default CreateGroup;
