import styled, { css } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import Signup from "./Signup.tsx";
import Login from "./Login.tsx";
import { ActionType } from "../context/types";
import { AuthMode, AuthResponse } from "../constants";
import { authenticate } from "../utils/requests.ts";

const StyledLogoContainer = styled.div<{ $mode: AuthMode }>`
  background: linear-gradient(to top, #43a5dc, #ff7bac);
  position: absolute;
  height: 100%;
  width: 50vw;
  transform: translate(100%);
  transition: transform 0.3s, border-radius 0.3s;

  & > StyledLogoContainer {
    display: none;
  }
  ${({ $mode }) => {
    switch ($mode) {
      case AuthMode.LOGIN:
        return css`
          border-radius: 40px 0 0 40px;
        `;
      case AuthMode.SIGNUP:
        return css`
          transform: translateX(0);
          border-radius: 0 40px 40px 0;
        `;
    }
  }}
`;

const StyledAuth = styled.main<{ $mode: AuthMode }>`
  background-color: grey;
  height: 100vh;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;

  & > div {
    flex: 1;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
    ${StyledLogoContainer} {
      display: none;
    }

    ${({ $mode }) => {
      switch ($mode) {
        case AuthMode.LOGIN:
          return css`
            & > div:nth-of-type(2) {
              display: none;
            }
          `;
        case AuthMode.SIGNUP:
          return css`
            & > div:first-of-type {
              display: none;
            }
          `;
      }
    }}
  }
`;

const AuthForm = () => {
  const [mode, setMode] = useState(AuthMode.LOGIN);
  const { dispatch } = useContext(Context);
  const [cachedUsername, setCachedUsername] = useState<string>();

  useEffect(() => {
    (async () => {
      const response = (await authenticate()) as AuthResponse;
      const { username, avatar } = response;

      dispatch({ type: ActionType.USERNAME, payload: username });
      dispatch({ type: ActionType.AVATAR, payload: avatar });
    })();
  }, [dispatch]);

  return (
    <StyledAuth $mode={mode}>
      <Login setMode={setMode} cachedUsername={cachedUsername} />
      <Signup setMode={setMode} setCachedUsername={setCachedUsername} />
      <StyledLogoContainer $mode={mode}>
        <img src="/logo.svg" width={200} height={200} />
      </StyledLogoContainer>
    </StyledAuth>
  );
};

export default AuthForm;
