import { useContext } from "react";
import ChatApp from "./chat/ChatApp";
import { Context } from "./context";
import styled, { createGlobalStyle, css } from "styled-components";
import AuthForm from "./auth/AuthForm";

const GlobalStyles = createGlobalStyle`
:root {
    --components-border-radius: 20px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  body,
  html,
  * {
    margin: 0;
    padding: 0;
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
  }
  p{
    
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  max-width: 500px;
  gap: 1rem 0;
  align-self: center;
`;

export const StyledButton = styled.button<{
  $isDark?: boolean;
  $isDisabled?: boolean;
}>`
  height: 3rem;
  background-color: ${({ $isDark }) => ($isDark ? "#000" : "#fff")};
  color: ${({ $isDark }) => ($isDark ? "#ffffff" : "#000000")};
  font-size: 1rem;
  border-radius: 8px;
  transition: color 0.3s, background-color 0.3s;

  &:hover {
    background-color: ${({ $isDark }) => ($isDark ? "#ffffff" : "#000000")};
    color: ${({ $isDark }) => ($isDark ? "#000000" : "#ffffff")};
    cursor: pointer;
  }

  ${({ $isDark, $isDisabled }) => {
    if ($isDisabled) {
      return css`
        opacity: 0.6;
        &:hover {
          background-color: ${$isDark ? "#000" : "#fff"};
          color: ${$isDark ? "#ffffff" : "#000000"};
        }
      `;
    }
  }}
`;

const App = () => {
  const {
    state: { username },
  } = useContext(Context);
  const content = username ? <ChatApp /> : <AuthForm />;

  return (
    <>
      <GlobalStyles />
      {content}
    </>
  );
};

export default App;
