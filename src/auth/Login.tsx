import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Context } from "../context";
import styled from "styled-components";
import InputField from "../components/InputField";
import { ActionType } from "../context/types";
import { StyledButton, StyledForm } from "../App";
import { AuthMode, AuthResponse } from "../constants";
import { demoLogin, login } from "../utils/requests";

const StyledLogin = styled.div`
  background-color: white;

  & > div {
    text-align: center;
    font-size: 3rem;
  }

  & > p > span {
    color: #0a7dbd;

    &:hover {
      cursor: pointer;
    }
  }
`;

interface LoginProps {
  setMode: Dispatch<SetStateAction<AuthMode>>;
  cachedUsername: string | undefined;
}

export default function Login({ setMode, cachedUsername }: LoginProps) {
  const { dispatch } = useContext(Context);
  const usernameRef = useRef<HTMLInputElement>();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = (await login(formData)) as AuthResponse;
    const { username, avatar } = response;

    dispatch({ type: ActionType.USERNAME, payload: username });
    console.log(document.cookie);
    if (avatar) {
      dispatch({
        type: ActionType.AVATAR,
        payload: `${avatar}?timestamp=${Date.now()}`,
      });
    }
  };

  useEffect(() => {
    if (!cachedUsername) return;
    setFormData({ username: cachedUsername, password: "" });
    if (usernameRef.current) {
      usernameRef.current.value = cachedUsername;
    }
  }, [cachedUsername]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDemoLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = (await demoLogin()) as AuthResponse;
    const { username, avatar } = response;

    dispatch({ type: ActionType.USERNAME, payload: username });
    if (avatar) {
      dispatch({
        type: ActionType.AVATAR,
        payload: `${avatar}?timestamp=${Date.now()}`,
      });
    }
  };

  return (
    <StyledLogin>
      <div>Welcome Back</div>
      <StyledForm>
        <InputField
          type="text"
          label="Username"
          id="login-username"
          placeholder="Enter username here"
          handleChange={handleChange}
          name="username"
          autoComplete="off"
          ref={usernameRef}
        />

        <InputField
          type="password"
          label="password"
          name="password"
          placeholder="Enter password here"
          id="login-password"
          handleChange={handleChange}
          isPassword
          autoComplete="current-password"
        />

        <StyledButton type="submit" onClick={handleLogin} $isDark>
          Login
        </StyledButton>
        <StyledButton type="submit" onClick={handleDemoLogin}>
          Demo Login
        </StyledButton>
      </StyledForm>
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => {
            setMode(AuthMode.SIGNUP);
          }}
        >
          Signup
        </span>
      </p>
    </StyledLogin>
  );
}
