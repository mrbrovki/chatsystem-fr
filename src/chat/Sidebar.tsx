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
  width: 8rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: ${(props) => props.theme.colors.sidebar};
  padding: 30px 10px;

  @media screen and (max-width: ${(props) => props.theme.breakpoints.xl}) {
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.xl}) {
    display: none;
  }

  @media screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.sm}) {
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
  }

  @media only screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
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
  height: 8rem;
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: #ffffff35;
  border-radius: 12px;
  transition: background-color 0.3s;

  gap: 10px;

  & > img {
    object-fit: cover;
    width: 5rem;
    height: 5rem;
  }

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
    dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
  };

  const switchToSettings = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.SETTINGS });
    dispatch({ type: ActionType.CURRENT_CHAT, payload: null });
  };

  return (
    <StyledSidebar>
      <StyledEditProfile onClick={switchToEdit}>
        <ProfilePicture handleClick={switchToEdit} />
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
