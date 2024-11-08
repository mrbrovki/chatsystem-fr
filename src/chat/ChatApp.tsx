import styled from "styled-components";
import Sidebar from "./Sidebar";
import OpenChat from "./OpenChat";
import Panel from "../panel/Panel";
import { useRef } from "react";
import { Client } from "@stomp/stompjs";

const StyledMain = styled.main`
  width: 100vw;
  height: 100svh;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.main.background};
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem;
  justify-content: space-between;
  gap: 1.5rem;
  position: relative;

  & > * {
    border-radius: 1rem;
  }

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: block;
    padding: 0;

    & > * {
      border-radius: 0;
    }
  }
`;

export default function ChatApp() {
  const stompClientRef = useRef<Client | null>(null);

  const closeConnection = () => {
    stompClientRef.current?.deactivate();
  };
  return (
    <>
      <StyledMain>
        <Sidebar closeConnection={closeConnection} />
        <Panel />
        <OpenChat ref={stompClientRef} />
      </StyledMain>
    </>
  );
}
