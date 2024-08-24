import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Context } from "../context";
import styled from "styled-components";
import InputField from "../components/InputField";
import { ActionType } from "../context/types";
import { fetchLogin } from "../utils/utils";
import { StyledButton, StyledForm } from "../App";
import { AuthMode } from "../constants";

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
}

export default function Login({ setMode }: LoginProps) {
  const { dispatch } = useContext(Context);

  const [formData, setFormData] = useState({
    username: "user1",
    password: "1234",
  });

  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await fetchLogin(formData);
    const token = response.accessToken;
    localStorage.setItem("jwt", token);
    dispatch({ type: ActionType.USERNAME, payload: formData.username });
    dispatch({
      type: ActionType.AVATAR,
      payload:
        "https://devbrovki-chat-avatars.s3.eu-central-1.amazonaws.com/" +
        formData.username,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

        <StyledButton type="submit" onClick={login} $isDark>
          Login
        </StyledButton>
        <StyledButton type="submit" onClick={login}>
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
