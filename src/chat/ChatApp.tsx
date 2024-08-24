import styled from "styled-components";
import Sidebar from "./Sidebar";
import OpenChat from "./OpenChat";
import Panel from "../panel/Panel";

const StyledMain = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #d9d9d9;
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
`;

export default function ChatApp() {
  return (
    <>
      <StyledMain>
        <Sidebar />
        <Panel />
        <OpenChat />
      </StyledMain>
    </>
  );
}
