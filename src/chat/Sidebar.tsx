import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Context } from "../context";
import { ActionType, PanelMode } from "../context/types";
import { logout } from "../utils/requests";

const ProfilePicture = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 0 2px #00000076;
  transition: transform 0.3s;
`;

const StyledSidebar = styled.aside`
  width: 120px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: linear-gradient(to top, #43a5dc, #ff7bac);
  padding: 30px 10px;

  & > *:hover {
    cursor: pointer;
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

    ${ProfilePicture} {
      transform: scale(1.1);
    }
  }
`;

interface SidebarProps {
  closeConnection: () => void; // Replace `any` with a more specific type if possible
}

const Sidebar: React.FC<SidebarProps> = ({ closeConnection }) => {
  const {
    state: { avatar },
    dispatch,
  } = useContext(Context);
  const [currentSrc, setCurrentSrc] = useState("/user-icon.svg");

  const handleLogout = async () => {
    const response = await logout();

    if (response.status === 204) {
      closeConnection();
      dispatch({ type: ActionType.RESET, payload: null });
    }
  };

  const onLogoClick = () => {
    dispatch({ type: ActionType.PANEL_MODE, payload: PanelMode.EDIT_PROFILE });
  };

  useEffect(() => {
    if (!avatar) return;
    setCurrentSrc(avatar);
  }, [avatar]);

  return (
    <StyledSidebar>
      <StyledEditProfile onClick={onLogoClick}>
        <ProfilePicture src={currentSrc} />
        <p>Profile</p>
      </StyledEditProfile>
      <LogoutIcon src="/logout-icon.svg" onClick={handleLogout} />
    </StyledSidebar>
  );
};

export default Sidebar;
