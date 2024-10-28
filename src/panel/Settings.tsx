/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { Context } from "../context";
import { deleteAccount, logout } from "../utils/requests";
import { ActionType, BtnPriority, PanelMode } from "../context/types";
import { StyledControl, StyledPanelButton } from "./Panel";
import Button from "../components/Button";

const Settings = () => {
  const { dispatch } = useContext(Context);
  const handleLogout = async () => {
    const response = await logout();
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

  return (
    <>
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
      <Button
        type="submit"
        handleClick={handleLogout}
        priority={BtnPriority.SECONDARY}
      >
        Logout
      </Button>
      <Button
        type="submit"
        handleClick={handleDeleteAccount}
        priority={BtnPriority.DANGER}
      >
        Delete My Account
      </Button>
    </>
  );
};

export default Settings;
