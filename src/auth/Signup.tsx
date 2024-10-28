import styled, { css } from "styled-components";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import InputField from "../components/InputField";
import { StyledForm } from "../App";
import { AuthMode, SignupFormData } from "../constants";
import { useUsernameExists } from "../hooks/useUsernameExists";
import { signup } from "../utils/requests";
import Button from "../components/Button";
import { BtnPriority } from "../context/types";

const StyledSignup = styled.div`
  background-color: #ffffff;
  position: relative;

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

const StyledCheck = styled.img<{ $isChecked: boolean }>`
  position: absolute;
  align-self: center;
  ${({ $isChecked }) => {
    if ($isChecked) {
      return css`
        width: 200px;
        height: 200px;
        transition: all 0.3s;
      `;
    } else {
      return css`
        width: 0;
        height: 0;
      `;
    }
  }}
`;

const StyledButton = styled(Button)<>``;

interface SignupProps {
  setMode: Dispatch<SetStateAction<AuthMode>>;
  setCachedUsername: Dispatch<SetStateAction<string | undefined>>;
}

const Signup = ({ setMode, setCachedUsername }: SignupProps) => {
  const [username, setUsername] = useState("");
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const { isAvailable } = useUsernameExists(username, "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsername(value);
  };

  useEffect(() => {
    const { email, password, confirmedPassword } = formData;

    if (isAvailable && email && password && confirmedPassword) {
      setIsDisabled(password !== confirmedPassword);
    } else {
      setIsDisabled(true);
    }
  }, [formData, isAvailable]);

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await signup({ ...formData, username });
    if (response) {
      setCachedUsername(username);
      setIsChecked(true);
      setTimeout(() => {
        setMode(AuthMode.LOGIN);
        setIsChecked(false);
      }, 1000);
    }
  };

  return (
    <StyledSignup>
      <div>Get started</div>
      <StyledForm>
        <InputField
          type="text"
          label="Display Name"
          id="signup-username"
          placeholder="Enter username here"
          name="username"
          handleChange={handleUsernameChange}
          isError={!isAvailable}
          errorContent="username already exists"
          priority="primary"
        />

        <InputField
          type="email"
          label="Email"
          id="signup-email"
          placeholder="Enter email here"
          name="email"
          handleChange={handleChange}
          autoComplete="off"
          priority="primary"
        />

        <InputField
          type="password"
          label="Password"
          placeholder="Enter password here"
          id="signup-password"
          handleChange={handleChange}
          name="password"
          isPassword
          autoComplete="new-password"
          priority="primary"
        />

        <InputField
          type="password"
          label="Confirm Password"
          placeholder="Confirm password here"
          id="signup-confirmed-password"
          handleChange={handleChange}
          name="confirmedPassword"
          isPassword
          isError={formData.password != formData.confirmedPassword}
          errorContent="passwords dont match!"
          autoComplete="new-password"
          priority="primary"
        />

        <StyledButton
          type="submit"
          handleClick={handleSignup}
          priority={BtnPriority.PRIMARY}
          isDisabled={isDisabled}
        >
          Signup
        </StyledButton>
      </StyledForm>
      <p>
        Already registered?{" "}
        <span
          onClick={() => {
            setMode(AuthMode.LOGIN);
          }}
        >
          Login
        </span>
      </p>
      <StyledCheck src="/check-icon.svg" $isChecked={isChecked} />
    </StyledSignup>
  );
};

export default Signup;
