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
import { StyledButton, StyledForm } from "../App";
import { AuthMode, SignupFormData } from "../constants";
import { useUsernameExists } from "../hooks/useUsernameExists";
import { signup } from "../utils/requests";

const StyleSignup = styled.div`
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

interface SignupProps {
  setMode: Dispatch<SetStateAction<AuthMode>>;
}

const Signup = ({ setMode }: SignupProps) => {
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
    const { username, email, password, confirmedPassword } = formData;

    if (username && email && password && confirmedPassword) {
      setIsDisabled(password !== confirmedPassword);
    }
  }, [formData]);

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await signup({ ...formData, username });
    if (response) {
      setIsChecked(true);
      setTimeout(() => {
        setMode(AuthMode.LOGIN);
        setIsChecked(false);
      }, 1000);
    }
  };

  return (
    <StyleSignup>
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
        />

        <InputField
          type="email"
          label="Email"
          id="signup-email"
          placeholder="Enter email here"
          name="email"
          handleChange={handleChange}
          autoComplete="off"
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
        />

        <StyledButton
          type="submit"
          onClick={handleSignup}
          $isDisabled={isDisabled}
          $isDark
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
      <StyledCheck src="./public/check-icon.svg" $isChecked={isChecked} />
    </StyleSignup>
  );
};

export default Signup;
