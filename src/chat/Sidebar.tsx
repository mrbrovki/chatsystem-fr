import { useContext } from "react";
import styled from "styled-components";
import { Context } from "../context";
import { ActionType, PanelMode } from "../context/types";
import { logout } from "../utils/requests";
import ProfilePicture from "../components/ProfilePicture";

const StyledSidebar = styled.aside`
  & > *:hover {
    cursor: pointer;
  }

  @media only screen and (min-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    width: 120px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background: ${(props) => props.theme.colors.sidebar};
    padding: 30px 10px;
  }

  @media only screen and (max-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    display: none;
  }
`;
const LogoutIcon = styled.img`
  width: 80%;
  margin-top: auto;
  transform: scale(1);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;
const StyledEditProfile = styled.div`
  height: 140px;
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: #ffffff35;
  border-radius: 12px;
  transition: background-color 0.3s;

  gap: 10px;

  & > p {
    color: white;
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
  }
  &:hover {
    background-color: #ffffff63;

    img {
      transform: scale(1.1);
    }
  }
`;
const SettingsIcon = styled.img`
  margin-top: 1rem;
  transition: transform 0.3s;
  &:hover {
    transform: rotateZ(90deg);
  }
`;

interface SidebarProps {
  closeConnection: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeConnection }) => {
  const { dispatch } = useContext(Context);

  const handleLogout = async () => {
    await logout();
    dispatch({ type: ActionType.RESET, payload: null });
    closeConnection();
  };

  const switchToEdit = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.EDIT_PROFILE });
  };

  const switchToSettings = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.SETTINGS });
  };

  return (
    <StyledSidebar>
      <StyledEditProfile onClick={switchToEdit}>
        <ProfilePicture width={80} height={80} handleClick={switchToEdit} />
        <p>Profile</p>
      </StyledEditProfile>
      <SettingsIcon
        src="/settings-icon.svg"
        width={64}
        onClick={switchToSettings}
      />
      <LogoutIcon src="/logout-icon.svg" onClick={handleLogout} />
    </StyledSidebar>
  );
};

export default Sidebar;
