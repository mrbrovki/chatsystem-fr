/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { StyledButton } from "../App";
import { Context } from "../context";
import { deleteAccount, logout } from "../utils/requests";
import { ActionType, PanelMode } from "../context/types";
import { StyledPanelButton } from "./Panel";

const Settings = () => {
  const { dispatch } = useContext(Context);
  const handleLogout = async () => {
    const response = await logout();

    if (response.status === 204) {
      //closeConnection();
      dispatch({ type: ActionType.RESET, payload: null });
    }
  };
  const handleDeleteAccount = async () => {
    await deleteAccount();
    dispatch({ type: ActionType.RESET, payload: null });
  };

  const back = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.USER_CHATS });
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
      <StyledButton onClick={handleLogout}>Logout</StyledButton>
      <StyledButton onClick={handleDeleteAccount}>
        Delete My Account
      </StyledButton>
    </>
  );
};

export default Settings;
