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
  background-color: ${(props) => props.theme.colors.panel.background};
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  width: 30rem;
  height: 100%;
  overflow: hidden;

  transition: width 0.3s ease-in;
  @media screen and (max-width: ${(props) => props.theme.breakpoints.xxl}) {
    width: 25rem;
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.lg}) {
    width: 20rem;
  }
  @media screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    transition: none;
    width: 100vw;
  }
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

export const StyledHeader = styled.header`
  position: relative;
  padding: 2rem 2rem 0 2rem;
`;

export const StyledControl = styled.div`
  height: 32px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  gap: 4px;

  & *:hover {
    cursor: pointer;
  }
  & > div:first-child,
  & > button:first-child {
    left: 0;
    margin-right: auto;
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
