import styled from "styled-components";
import Sidebar from "./Sidebar";
import OpenChat from "./OpenChat";
import Panel from "../panel/Panel";
import { useRef } from "react";
import { Client } from "@stomp/stompjs";

const StyledMain = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #d9d9d9;

  @media only screen and (min-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0 1rem;
    justify-content: space-between;
    gap: 20px;

    & > * {
      height: 95%;
      border-radius: var(--components-border-radius);
      background-color: #fff;
    }
  }

  @media only screen and (max-width: ${(props) =>
      props.theme.breakpoints.tablet}) {
    & > * {
      height: 100%;
      background-color: #fff;
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
