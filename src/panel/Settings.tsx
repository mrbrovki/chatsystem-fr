/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { Context } from "../context";
import { deleteAccount, logout } from "../utils/requests";
import { ActionType, BtnPriority, PanelMode } from "../context/types";
import { StyledControl, StyledHeader, StyledPanelButton } from "./Panel";
import Button from "../components/Button";
import styled from "styled-components";

const ButtonsWrapper = styled.div`
  padding: 2rem;
`;
const Settings = () => {
  const { dispatch } = useContext(Context);
  const handleLogout = async () => {
    await logout();
    console.clear();
    dispatch({ type: ActionType.RESET, payload: null });
    //closeConnection();
  };
  const handleDeleteAccount = async () => {
    await deleteAccount();
    dispatch({ type: ActionType.RESET, payload: null });
  };

  const back = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
  };

  const switchToEdit = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.EDIT_PROFILE });
    dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
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
        </StyledControl>
      </StyledHeader>

      <ButtonsWrapper>
        <Button
          type="submit"
          handleClick={switchToEdit}
          priority={BtnPriority.SECONDARY}
        >
          edit profile
        </Button>
        <Button
          type="submit"
          handleClick={handleLogout}
          priority={BtnPriority.SECONDARY}
        >
          logout
        </Button>
        <Button
          type="submit"
          handleClick={handleDeleteAccount}
          priority={BtnPriority.DANGER}
        >
          delete my account
        </Button>
      </ButtonsWrapper>
    </>
  );
};

export default Settings;
