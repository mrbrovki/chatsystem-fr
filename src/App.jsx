import {useContext } from 'react'
import Chat from './Chat';
import { Context } from './context';
import { createGlobalStyle } from 'styled-components';
import AuthForm from './auth/AuthForm';

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
function App() {
  const {state: {username}} = useContext(Context);
  let content = username ? 
  <Chat /> : 
  <AuthForm />

  return (
    <>
      <GlobalStyles />
      {content}
    </>
  )
}


export default App
