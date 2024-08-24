import styled, { css } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context";
import Signup from "./Signup.tsx";
import Login from "./Login.tsx";
import { ActionType } from "../context/types";
import { fetchAuth } from "../utils/utils";
import { AuthMode } from "../constants";

const StyledAuth = styled.main`
  background-color: grey;
  height: 100vh;
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
    padding: 0 50px;
  }
`;

const StyledLogoContainer = styled.div<{ $mode: AuthMode }>`
  background: linear-gradient(to top, #43a5dc, #ff7bac);
  position: absolute;
  height: 100%;
  width: 50%;
  transform: translate(100%);
  transition: transform 0.3s, border-radius 0.3s;

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

const AuthForm = () => {
  const [mode, setMode] = useState(AuthMode.LOGIN);
  const { dispatch } = useContext(Context);

  useEffect(() => {
    const authenticate = async () => {
      const token = localStorage.getItem("jwt");
      if (token) {
        const json = (await fetchAuth()) as any;
        localStorage.setItem("jwt", json.accessToken);
        dispatch({ type: ActionType.USERNAME, payload: json.username });
        dispatch({
          type: ActionType.AVATAR,
          payload:
            "https://devbrovki-chat-avatars.s3.eu-central-1.amazonaws.com/" +
            json.username,
        });
      }
    };

    authenticate();
  }, [dispatch]);

  return (
    <StyledAuth>
      <Login setMode={setMode} />
      <Signup setMode={setMode} />
      <StyledLogoContainer $mode={mode}>
        <img src="./public/logo.svg" width={200} height={200} />
      </StyledLogoContainer>
    </StyledAuth>
  );
};

export default AuthForm;
