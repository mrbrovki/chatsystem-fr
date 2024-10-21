import { useContext } from "react";
import CreateChat from "./CreateChat";
import EditProfile from "./EditProfile";
import styled from "styled-components";
import { Context } from "../context";
import CreateGroup from "./CreateGroup";
import { PanelMode } from "../context/types";
import UserChats from "./UserChats";
import Settings from "./Settings";

const StyledPanel = styled.div`
  background-color: #fff;
  padding: 32px;
  flex: 3;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem 0;
  height: 100%;
`;

export const StyledPanelButton = styled.button<{
  $color: string;
  $hoverColor: string;
}>`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.$color};
  font-size: 1rem;
  display: block;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  &:hover {
    color: ${(props) => props.$hoverColor};
  }
`;

const Panel = () => {
  const {
    state: { panelMode },
  } = useContext(Context);
  let panel;

  switch (panelMode) {
    case PanelMode.USER_CHATS:
      panel = <UserChats />;
      break;
    case PanelMode.CREATE_CHAT:
      panel = <CreateChat />;
      break;
    case PanelMode.EDIT_PROFILE:
      panel = <EditProfile />;
      break;
    case PanelMode.CREATE_GROUP:
      panel = <CreateGroup />;
      break;
    case PanelMode.SETTINGS:
      panel = <Settings />;
      break;
    default:
      panel = <UserChats />;
      break;
  }
  return <StyledPanel>{panel}</StyledPanel>;
};

export default Panel;
