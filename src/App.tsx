import { useContext } from "react";
import ChatApp from "./chat/ChatApp";
import { Context } from "./context";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import AuthForm from "./auth/AuthForm";
import { theme } from "./constants/themes";

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
  align-self: center;
`;

const App = () => {
  const {
    state: { username },
  } = useContext(Context);
  const content = username ? <ChatApp /> : <AuthForm />;

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={theme}>{content}</ThemeProvider>
    </>
  );
};

export default App;
